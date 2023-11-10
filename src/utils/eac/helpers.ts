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

export async function invalidateStatus(
  denoKv: Deno.Kv,
  status: EaCStatus,
  maxRunTimeSeconds = 60,
): Promise<void> {
  const now = new Date(Date.now());

  const maxRunTime = new Date(
    status.StartTime.getSeconds() + maxRunTimeSeconds,
  );

  if (maxRunTime.getTime() < now.getTime()) {
    status.Processing = EaCStatusProcessingTypes.ERROR;

    status.EndTime = new Date(Date.now());

    await denoKv
      .atomic()
      .set(["EaC", "Status", "ID", status.ID], status)
      .delete(["EaC", "Status", "Eac", status.EnterpriseLookup])
      .delete(["EaC", "Processing", status.EnterpriseLookup])
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
  status: EaCStatus,
  msg: T,
  handler: (msg: T) => Promise<void>,
  maxRunTimeSeconds = 60,
  sleepFor = 250,
): Promise<void> {
  // TODO: need to handle status invalidation in api calls, not here so that the status can be reset before starting a new one...
  await invalidateStatus(denoKv, status, maxRunTimeSeconds);

  const key = ["EaC", "Processing", status.EnterpriseLookup];

  await waitOnProcessing(denoKv, key, msg, status.ID, handler, sleepFor);
}
