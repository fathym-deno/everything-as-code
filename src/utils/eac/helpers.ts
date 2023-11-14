import { EaCStatus } from "../../api/models/EaCStatus.ts";
import { EaCStatusProcessingTypes } from "../../api/models/EaCStatusProcessingTypes.ts";
import { hasKvEntry, waitOnProcessing } from "../deno-kv/helpers.ts";

export async function eacExists(
  denoKv: Deno.Kv,
  entLookup: string,
): Promise<boolean> {
  let exists = await hasKvEntry(denoKv, ["EaC", entLookup]);

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Archive", entLookup]);
  }

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Processing", entLookup]);
  }

  return exists;
}

export async function invalidateProcessing(
  denoKv: Deno.Kv,
  entLookup: string,
  maxRunTimeSeconds = 60,
): Promise<void> {
  const status = await denoKv.get<EaCStatus>([
    "EaC",
    "Status",
    "Eac",
    entLookup,
  ]);

  if (status?.value) {
    const now = new Date(Date.now());

    const maxRunTime = new Date(
      status.value.StartTime.getSeconds() + maxRunTimeSeconds,
    );

    if (maxRunTime.getTime() < now.getTime()) {
      status.value.Processing = EaCStatusProcessingTypes.ERROR;

      status.value.Messages = {
        Error: "Invalidated",
      };

      status.value.EndTime = new Date(Date.now());

      await markEaCProcessed(entLookup, denoKv.atomic())
        .set(["EaC", "Status", "ID", status.value.ID], status)
        .commit();
    }
  } else {
    await markEaCProcessed(entLookup, denoKv.atomic())
      .commit();
  }
}

export function markEaCProcessed(
  entLookup: string,
  atomicOp: Deno.AtomicOperation,
): Deno.AtomicOperation {
  return atomicOp
    .delete(["EaC", "Processing", entLookup])
    .delete(["EaC", "Status", "Eac", entLookup]);
}

export async function waitOnEaCProcessing<T>(
  denoKv: Deno.Kv,
  entLookup: string,
  commitId: string,
  msg: T,
  handler: (msg: T) => Promise<void>,
  maxRunTimeSeconds = 60,
  sleepFor = 250,
): Promise<void> {
  await invalidateProcessing(denoKv, entLookup, maxRunTimeSeconds);

  const key = ["EaC", "Processing", entLookup];

  await waitOnProcessing(denoKv, key, msg, commitId, handler, sleepFor);
}
