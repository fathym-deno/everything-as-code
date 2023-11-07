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
  msg: T,
  handler: (msg: T) => Promise<void>,
  sleepFor = 250,
): Promise<void> {
  const key = ["EaC", "Processing", entLookup];

  await waitOnProcessing(denoKv, key, msg, handler, sleepFor);
}
