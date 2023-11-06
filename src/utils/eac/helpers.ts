import { options } from "preact";
import { sleep } from "../sleep.ts";
import { hasKvEntry, waitOnProcessing } from "../deno-kv/helpers.ts";

export async function eacExists(
  denoKv: Deno.Kv,
  enterpriseLookup: string,
): Promise<boolean> {
  let exists = await hasKvEntry(denoKv, ["EaC", enterpriseLookup]);

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Archive", enterpriseLookup]);
  }

  if (!exists) {
    exists = await hasKvEntry(denoKv, ["EaC", "Processing", enterpriseLookup]);
  }

  return exists;
}

export function markEaCProcessed(
  enterpriseLookup: string,
  atomicOp: Deno.AtomicOperation,
): Deno.AtomicOperation {
  return atomicOp.delete(["EaC", "Processing", enterpriseLookup]);
}

export async function waitOnEaCProcessing<T>(
  denoKv: Deno.Kv,
  enterpriseLookup: string,
  msg: T,
  handler: (msg: T) => Promise<void>,
  sleepFor = 250,
): Promise<void> {
  const key = ["EaC", "Processing", enterpriseLookup];

  await waitOnProcessing(denoKv, key, msg, handler, sleepFor);
}
