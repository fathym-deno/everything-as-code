import { denoKv } from "../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCDeleteRequest } from "../../src/api/models/EaCDeleteRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";

export async function handleEaCDeleteRequest(deleteReq: EaCDeleteRequest) {
  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    deleteReq.EnterpriseLookup,
    "ID",
    deleteReq.CommitID,
  ]);

  await waitOnEaCProcessing(
    denoKv,
    status.value!.EnterpriseLookup,
    status.value!.ID,
    deleteReq,
    handleEaCDeleteRequest,
    deleteReq.ProcessingSeconds,
  );

  const eac = await denoKv.get<EverythingAsCode>([
    "EaC",
    deleteReq.EnterpriseLookup,
  ]);

  if (deleteReq.Archive) {
    const userEaCResults = await denoKv.list<UserEaCRecord>({
      prefix: ["EaC", "Users", deleteReq.EnterpriseLookup],
    });

    const userEaCRecords: UserEaCRecord[] = [];

    for await (const userEaCRecord of userEaCResults) {
      userEaCRecords.push(userEaCRecord.value);
    }

    status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;

    status.value!.EndTime = new Date();

    await listenQueueAtomic(denoKv, deleteReq, (op) => {
      op = markEaCProcessed(deleteReq.EnterpriseLookup, op)
        .check(eac)
        .check(status)
        .set(["EaC", "Archive", deleteReq.EnterpriseLookup], eac.value)
        .delete(["EaC", deleteReq.EnterpriseLookup])
        .set(
          [
            "EaC",
            "Status",
            deleteReq.EnterpriseLookup,
            "ID",
            deleteReq.CommitID,
          ],
          status.value,
        );

      for (const userEaCRecord of userEaCRecords) {
        if (!userEaCRecord.Owner) {
          op = op
            .delete([
              "EaC",
              "Users",
              deleteReq.EnterpriseLookup,
              userEaCRecord.Username,
            ])
            .delete([
              "User",
              userEaCRecord.Username,
              "EaC",
              deleteReq.EnterpriseLookup,
            ]);
        }
      }

      return op;
    });
  } else {
    //  TODO: Execute delete operations
  }
}
