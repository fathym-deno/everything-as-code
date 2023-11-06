import { denoKv } from "../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../src/EverythingAsCode.ts";
import { listenQueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { EaCDeleteRequest } from "../../src/api/models/EaCDeleteRequest.ts";
import {
  markEaCProcessed,
  waitOnEaCProcessing,
} from "../../src/utils/eac/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCUserRecord } from "../../src/api/EaCUserRecord.ts";

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
    const eacUserResults = await denoKv.list<EaCUserRecord>({
      prefix: ["EaC", "Users", deleteReq.EnterpriseLookup],
    });

    const eacUserRecords: EaCUserRecord[] = [];

    for await (const eacUserRecord of eacUserResults) {
      eacUserRecords.push(eacUserRecord.value);
    }

    const userEaCKeys = eacUserRecords.map((eur) =>
      !eur.Owner
        ? ["User", eur.Username, "EaC", deleteReq.EnterpriseLookup]
        : undefined
    );

    const userEaCRemovalKeys: string[][] = userEaCKeys
      .filter((uek) => uek)
      .map((uek) => uek!);

    const userEaCRemovals = await denoKv.getMany<UserEaCRecord[]>(
      userEaCRemovalKeys,
    );

    await listenQueueAtomic(denoKv, deleteReq, (op) => {
      op = markEaCProcessed(deleteReq.EnterpriseLookup, op)
        .check(eac)
        .set(["EaC", "Archive", deleteReq.EnterpriseLookup], eac.value)
        .delete(["EaC", deleteReq.EnterpriseLookup]);

      for (const eacUserRecord of eacUserRecords) {
        if (!eacUserRecord.Owner) {
          op = op.delete([
            "EaC",
            "Users",
            deleteReq.EnterpriseLookup,
            eacUserRecord.Username,
          ]);
        }
      }

      for (const userEaCRemoval of userEaCRemovals) {
        if (!userEaCRemoval.value!.Owner) {
          const username = userEaCRemoval.key[1];

          op = op.delete([
            "User",
            username,
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
