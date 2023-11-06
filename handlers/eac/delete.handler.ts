import { denoKv } from "../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../src/EverythingAsCode.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCDeleteRequest } from "../../src/api/models/EaCDeleteRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";

export async function handleEaCDeleteRequest(deleteReq: EaCDeleteRequest) {
  await waitOnEaCProcessing(
    denoKv,
    deleteReq.EnterpriseLookup,
    deleteReq,
    handleEaCDeleteRequest,
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

    await listenQueueAtomic(denoKv, deleteReq, (op) => {
      op = markEaCProcessed(deleteReq.EnterpriseLookup, op)
        .check(eac)
        .set(["EaC", "Archive", deleteReq.EnterpriseLookup], eac.value)
        .delete(["EaC", deleteReq.EnterpriseLookup]);

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
