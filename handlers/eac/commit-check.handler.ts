import { denoKv } from "../../configs/deno-kv.config.ts";
import {
  enqueueAtomic,
  enqueueAtomicOperation,
  listenQueueAtomic,
} from "../../src/utils/deno-kv/helpers.ts";
import { EaCCommitCheckRequest } from "../../src/api/models/EaCCommitCheckRequest.ts";
import { EaCHandlerCheckRequest } from "../../src/api/models/EaCHandlerCheckRequest.ts";
import { EaCHandlerErrorResponse } from "../../src/api/models/EaCHandlerErrorResponse.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";
import {
  callEaCHandlerCheck,
  markEaCProcessed,
} from "../../src/utils/eac/helpers.ts";
import { sleep } from "../../src/utils/sleep.ts";
import { merge } from "@fathym/common";

export async function handleEaCCommitCheckRequest(
  commitCheckReq: EaCCommitCheckRequest,
) {
  const {
    EnterpriseLookup,
    ParentEnterpriseLookup,
    Details,
    Handlers,
    ...eacDiff
  } = commitCheckReq.EaC;

  const statusKey = [
    "EaC",
    "Status",
    EnterpriseLookup!,
    "ID",
    commitCheckReq.CommitID,
  ];

  const status = await denoKv.get<EaCStatus>(statusKey);

  const errors: EaCHandlerErrorResponse[] = [];

  const allChecks: EaCHandlerCheckRequest[] = [];

  delete status.value!.Messages.Queued;

  let checkResponses = await Promise.all(
    commitCheckReq.Checks.map(async (check) => {
      const checkResp = await callEaCHandlerCheck(
        Handlers!,
        commitCheckReq.JWT,
        check,
      );

      status.value!.Messages = merge(
        status.value!.Messages,
        checkResp.Messages,
      );

      await denoKv.set(statusKey, status.value!);

      if (checkResp.HasError) {
        errors.push({
          HasError: true,
          Messages: checkResp.Messages,
        });
      }

      if (!checkResp.Complete) {
        allChecks.push(check);
      }

      return checkResp;
    }),
  );

  if (errors.length > 0) {
    status.value!.Processing = EaCStatusProcessingTypes.ERROR;

    for (const error of errors) {
      status.value!.Messages = merge(status.value!.Messages, error.Messages);
    }

    status.value!.EndTime = new Date();
  } else if (allChecks.length > 0) {
    status.value!.Processing = EaCStatusProcessingTypes.PROCESSING;

    await sleep(5000);
  } else {
    status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;

    status.value!.EndTime = new Date();
  }

  await listenQueueAtomic(denoKv, commitCheckReq, (op) => {
    op = op
      .set(
        [
          "EaC",
          "Status",
          commitCheckReq.EaC.EnterpriseLookup!,
          "ID",
          commitCheckReq.CommitID,
        ],
        status.value,
      )
      .set(
        ["EaC", "Status", commitCheckReq.EaC.EnterpriseLookup!, "EaC"],
        status.value,
      );

    if (allChecks.length > 0) {
      const newCommitCheckReq: EaCCommitCheckRequest = {
        ...commitCheckReq,
        Checks: allChecks,
        nonce: undefined,
        versionstamp: undefined,
      };

      op = enqueueAtomicOperation(op, newCommitCheckReq);
    } else if (errors.length === 0) {
      op = markEaCProcessed(EnterpriseLookup!, op).set(
        ["EaC", commitCheckReq.EaC.EnterpriseLookup!],
        commitCheckReq.EaC,
      );
    } else {
      op = markEaCProcessed(commitCheckReq.EaC.EnterpriseLookup!, op);
    }

    return op;
  });
}
