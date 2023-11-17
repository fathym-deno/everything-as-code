import { denoKv } from "../../configs/deno-kv.config.ts";
import { eacHandlers } from "../../configs/eac-handlers.config.ts";
import {
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
  const { EnterpriseLookup, ParentEnterpriseLookup, Details, ...eacDiff } =
    commitCheckReq.EaC;

  const statusKey = ["EaC", "Status", "ID", commitCheckReq.CommitID];

  const status = await denoKv.get<EaCStatus>(statusKey);

  const errors: EaCHandlerErrorResponse[] = [];

  let checkResponses = await Promise.all(
    commitCheckReq.Checks.map(async (check) => {
      const checkResp = await callEaCHandlerCheck(
        eacHandlers,
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

      return checkResp;
    }),
  );

  // TODO: Process checkResponses to determine which are completed, and only pass non completed ones forward

  const allChecks: EaCHandlerCheckRequest[] = [];

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

  await listenQueueAtomic(denoKv, commitCheckReq, (op) => {
    op = op
      .check(status)
      .set(["EaC", "Status", "ID", commitCheckReq.CommitID], status.value);

    if (status.value!.Processing) {
      const newCommitCheckReq: EaCCommitCheckRequest = {
        ...commitCheckReq,
        Checks: allChecks,
      };

      op = enqueueAtomicOperation(op, newCommitCheckReq);
    } else {
      op = markEaCProcessed(EnterpriseLookup!, op);
    }

    return op;
  });

  if (allChecks.length > 0) {
    await sleep(1000);
  }
}
