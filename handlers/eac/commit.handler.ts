import { denoKv } from "../../configs/deno-kv.config.ts";
import { EaCDiff, EverythingAsCode } from "../../src/EverythingAsCode.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import { sleep } from "../../src/utils/sleep.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCUserRecord } from "../../src/api/EaCUserRecord.ts";

export async function handleEaCCommitRequest(commitReq: EaCCommitRequest) {
  if (!commitReq.EaC.EnterpriseLookup) {
    throw new Error("The enterprise lookup must be provided.");
  }

  const enterpriseLookup = commitReq.EaC.EnterpriseLookup;

  await waitOnEaCProcessing(
    denoKv,
    enterpriseLookup,
    commitReq,
    handleEaCCommitRequest,
  );

  const eacDiff = commitReq.EaC as EaCDiff;

  const existingEaC = await denoKv.get<EverythingAsCode>([
    "EaC",
    enterpriseLookup,
  ]);

  const diffKeys = Object.keys(eacDiff);

  //  TODO: Differential update

  await listenQueueAtomic(denoKv, commitReq, (op) => {
    op = markEaCProcessed(enterpriseLookup, op)
      .set(["EaC", enterpriseLookup], existingEaC)
      .delete(["EaC", "Processing", enterpriseLookup]);

    if (commitReq.Username) {
      op = op
        .set(["User", commitReq.Username, "EaC", enterpriseLookup], {
          EnterpriseLookup: enterpriseLookup,
          Owner: true,
        } as UserEaCRecord)
        .set(
          ["EaC", "Users", enterpriseLookup, commitReq.Username],
          {
            Username: commitReq.Username,
            Owner: true,
          } as EaCUserRecord,
        );
    }

    return op;
  });
}
