import { merge } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";

export async function handleEaCCommitRequest(commitReq: EaCCommitRequest) {
  if (!commitReq.EaC.EnterpriseLookup) {
    throw new Error("The enterprise lookup must be provided.");
  }

  if (commitReq.EaC.Details && !commitReq.EaC.Details!.Description) {
    commitReq.EaC.Details.Description = commitReq.EaC.Details.Name;
  }

  const { EnterpriseLookup, ParentEnterpriseLookup, Details, ...eacDiff } =
    commitReq.EaC;

  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    "ID",
    commitReq.CommitID,
  ]);

  await waitOnEaCProcessing(
    denoKv,
    status.value!.EnterpriseLookup,
    status.value!.ID,
    commitReq,
    handleEaCCommitRequest,
  );

  const existingEaC = await denoKv.get<EverythingAsCode>([
    "EaC",
    EnterpriseLookup,
  ]);

  const saveEaC: EverythingAsCode = existingEaC.value || {
    EnterpriseLookup,
    ParentEnterpriseLookup,
  };

  const diffKeys = Object.keys(eacDiff);

  if (Details) {
    saveEaC.Details = Details;
  }

  for (const key of diffKeys) {
    const diff = eacDiff[key];

    if (diff) {
      if (
        !Array.isArray(diff) &&
        typeof diff === "object" &&
        diff !== null &&
        diff !== undefined
      ) {
        // TODO: Call Handler API definition for EaC key
        saveEaC[key] = merge(existingEaC.value![key] as object, diff);
      } else if (diff !== undefined && diff !== null) {
        saveEaC[key] = diff;
      }
    }
  }

  //  TODO: Differential update

  status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;

  status.value!.EndTime = new Date();

  await listenQueueAtomic(denoKv, commitReq, (op) => {
    op = markEaCProcessed(EnterpriseLookup, op)
      .check(existingEaC)
      .check(status)
      .set(["EaC", EnterpriseLookup], saveEaC)
      .set(["EaC", "Status", "ID", commitReq.CommitID], status.value);

    if (commitReq.Username) {
      const userEaCRecord: UserEaCRecord = {
        EnterpriseLookup: EnterpriseLookup,
        EnterpriseName: saveEaC.Details!.Name!,
        Owner: true,
        Username: commitReq.Username,
      };

      op = op
        .set(
          ["User", commitReq.Username, "EaC", EnterpriseLookup],
          userEaCRecord,
        )
        .set(
          ["EaC", "Users", EnterpriseLookup, commitReq.Username],
          userEaCRecord,
        );
    }

    return op;
  });
}
