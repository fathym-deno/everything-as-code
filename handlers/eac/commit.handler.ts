// deno-lint-ignore-file no-explicit-any
import { merge } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";
import {
  enqueueAtomicOperation,
  listenQueueAtomic,
} from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import {
  callEaCHandler,
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";
import { EaCMetadataBase } from "../../src/eac/EaCMetadataBase.ts";
import { EaCHandlerErrorResponse } from "../../src/api/models/EaCHandlerErrorResponse.ts";
import { EaCHandlerCheckRequest } from "../../src/api/models/EaCHandlerCheckRequest.ts";
import { EaCCommitCheckRequest } from "../../src/api/models/EaCCommitCheckRequest.ts";
import { eacHandlers } from "../../configs/eac-handlers.config.ts";

export async function handleEaCCommitRequest(commitReq: EaCCommitRequest) {
  if (!commitReq.EaC.EnterpriseLookup) {
    throw new Error("The enterprise lookup must be provided.");
  }

  if (commitReq.EaC.Details && !commitReq.EaC.Details!.Description) {
    commitReq.EaC.Details.Description = commitReq.EaC.Details.Name;
  }

  const { EnterpriseLookup, ParentEnterpriseLookup, Details, ...eacDiff } =
    commitReq.EaC;

  const statusKey = ["EaC", "Status", "ID", commitReq.CommitID];

  let status = await denoKv.get<EaCStatus>(statusKey);

  await waitOnEaCProcessing(
    denoKv,
    status.value!.EnterpriseLookup,
    status.value!.ID,
    commitReq,
    handleEaCCommitRequest,
    commitReq.ProcessingSeconds,
  );

  const existingEaC = await denoKv.get<EverythingAsCode>([
    "EaC",
    EnterpriseLookup,
  ]);

  const saveEaC: EverythingAsCode = existingEaC?.value! || {
    EnterpriseLookup,
    ParentEnterpriseLookup,
  };

  const diffKeys = Object.keys(eacDiff);

  if (Details) {
    saveEaC.Details = Details;
  }

  const errors: EaCHandlerErrorResponse[] = [];

  const allChecks: EaCHandlerCheckRequest[] = [];

  for (const key of diffKeys) {
    const diff = eacDiff[key];

    if (diff) {
      if (
        !Array.isArray(diff) &&
        typeof diff === "object" &&
        diff !== null &&
        diff !== undefined
      ) {
        const handled = await callEaCHandler(
          eacHandlers,
          commitReq.JWT,
          key,
          saveEaC,
          diff as EaCMetadataBase,
        );

        allChecks.push(...(handled.Checks || []));

        saveEaC[key] = handled.Result;

        errors.push(...handled.Errors);
      } else if (diff !== undefined) {
        saveEaC[key] = diff;
      }
    }
  }

  if (errors.length > 0) {
    status.value!.Processing = EaCStatusProcessingTypes.ERROR;

    for (const error of errors) {
      status.value!.Messages = merge(status.value!.Messages, error.Messages);
    }

    status.value!.EndTime = new Date();
  } else if (allChecks.length > 0) {
    status.value!.Processing = EaCStatusProcessingTypes.CHECKING;
  } else {
    status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;

    status.value!.EndTime = new Date();
  }

  await listenQueueAtomic(denoKv, commitReq, (op) => {
    op = op
      .check(existingEaC)
      .check(status)
      .set(["EaC", EnterpriseLookup], saveEaC)
      .set(["EaC", "Status", "ID", commitReq.CommitID], status.value);

    if (status.value!.Processing) {
      const commitCheckReq: EaCCommitCheckRequest = {
        ...commitReq,
        Checks: allChecks,
      };

      op = enqueueAtomicOperation(op, commitCheckReq);
    } else {
      op = markEaCProcessed(EnterpriseLookup, op);
    }

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
