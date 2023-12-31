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
  console.log(`Processing EaC delete for ${deleteReq.CommitID}`);

  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    deleteReq.EaC.EnterpriseLookup!,
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
    deleteReq.EaC.EnterpriseLookup!,
  ]);

  const userEaCResults = await denoKv.list<UserEaCRecord>({
    prefix: ["EaC", "Users", deleteReq.EaC.EnterpriseLookup!],
  });

  const userEaCRecords: UserEaCRecord[] = [];

  for await (const userEaCRecord of userEaCResults) {
    userEaCRecords.push(userEaCRecord.value);
  }

  delete status.value!.Messages.Queued;

  if (deleteReq.Archive) {
    status.value!.Processing = EaCStatusProcessingTypes.COMPLETE;
  } else {
    //  TODO: Execute delete operations
    status.value!.Processing = EaCStatusProcessingTypes.ERROR;

    status.value!.Messages = {
      Error: "Not implemented",
    };
  }

  status.value!.EndTime = new Date();

  console.log(`Processed EaC delete for ${deleteReq.CommitID}:`);
  console.log(status.value!);

  await listenQueueAtomic(denoKv, deleteReq, (op) => {
    op = markEaCProcessed(deleteReq.EaC.EnterpriseLookup!, op)
      .check(eac)
      .check(status)
      .set(
        [
          "EaC",
          "Status",
          deleteReq.EaC.EnterpriseLookup!,
          "ID",
          deleteReq.CommitID,
        ],
        status.value,
      );

    if (deleteReq.Archive) {
      op = op
        .set(["EaC", "Archive", deleteReq.EaC.EnterpriseLookup!], eac.value)
        .delete(["EaC", deleteReq.EaC.EnterpriseLookup!]);

      for (const userEaCRecord of userEaCRecords) {
        op = op
          .delete([
            "EaC",
            "Users",
            deleteReq.EaC.EnterpriseLookup!,
            userEaCRecord.Username,
          ])
          .delete([
            "User",
            userEaCRecord.Username,
            "EaC",
            deleteReq.EaC.EnterpriseLookup!,
          ]);

        if (userEaCRecord.Owner) {
          op = op
            .set([
              "EaC",
              "Archive",
              "Users",
              deleteReq.EaC.EnterpriseLookup!,
              userEaCRecord.Username,
            ], userEaCRecord)
            .set([
              "User",
              userEaCRecord.Username,
              "Archive",
              "EaC",
              deleteReq.EaC.EnterpriseLookup!,
            ], userEaCRecord);
        }
      }
    } else {
      op = op.set(["EaC", deleteReq.EaC.EnterpriseLookup!], deleteReq.EaC);
    }

    return op;
  });
}
