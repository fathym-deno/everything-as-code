import { denoKv } from "../../configs/deno-kv.config.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCDiff, EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";

export async function handleEaCCommitRequest(commitReq: EaCCommitRequest) {
  if (!commitReq.EaC.EnterpriseLookup) {
    throw new Error("The enterprise lookup must be provided.");
  }

  const entLookup = commitReq.EaC.EnterpriseLookup;

  await waitOnEaCProcessing(
    denoKv,
    entLookup,
    commitReq,
    handleEaCCommitRequest,
  );

  const eacDiff = commitReq.EaC as EaCDiff;

  const existingEaC = await denoKv.get<EverythingAsCode>([
    "EaC",
    entLookup,
  ]);

  const diffKeys = Object.keys(eacDiff);

  diffKeys.toString();

  //  TODO: Differential update

  await listenQueueAtomic(denoKv, commitReq, (op) => {
    op = markEaCProcessed(entLookup, op)
      .set(["EaC", entLookup], existingEaC)
      .delete(["EaC", "Processing", entLookup]);

    if (commitReq.Username) {
      const userEaCRecord: UserEaCRecord = {
        EnterpriseLookup: entLookup,
        Owner: true,
        Username: commitReq.Username,
      };

      op = op
        .set(
          ["User", commitReq.Username, "EaC", entLookup],
          userEaCRecord,
        )
        .set(
          ["EaC", "Users", entLookup, commitReq.Username],
          userEaCRecord,
        );
    }

    return op;
  });
}
