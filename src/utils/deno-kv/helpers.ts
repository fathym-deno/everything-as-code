import { sleep } from "../sleep.ts";
import { AtomicOperationHandler } from "./AtomicOperationHandler.ts";
import { DenoKVNonce } from "./DenoKVNonce.ts";

export async function hasKvEntry(
  denoKv: Deno.Kv,
  key: Deno.KvKey,
): Promise<boolean> {
  const entry = await denoKv.get(key);

  return !!entry?.value;
}

export async function enqueueAtomic(
  denoKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler?: AtomicOperationHandler,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  msg.nonce = crypto.randomUUID();

  let atomic = denoKv
    .atomic()
    .check({ key: ["nonces", msg.nonce], versionstamp: null })
    .enqueue(msg)
    .set(["nonces", msg.nonce], true)
    .sum(["enqueued_count"], 1n);

  if (atomicOpHandler) {
    atomic = await atomicOpHandler(atomic);
  }

  return await atomic.commit();
}

export async function listenQueueAtomic(
  denoKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler: AtomicOperationHandler,
) {
  if (!msg.nonce || !msg.versionstamp) {
    throw new Error(
      `The message is required to have a nonce and versionstamp value.`,
    );
  }

  const nonce = await denoKv.get<DenoKVNonce>(["nonces", msg.nonce]);

  let atomic = denoKv
    .atomic()
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n);

  atomic = await atomicOpHandler(atomic);

  return await atomic.commit();
}

export async function waitOnProcessing<T>(
  denoKv: Deno.Kv,
  key: Deno.KvKey,
  msg: T,
  handler: (msg: T) => Promise<void>,
  sleepFor = 250,
) {
  const processing = await denoKv.get<boolean>(key);

  if (processing.value) {
    await sleep(sleepFor);

    await handler(msg);
  }

  await denoKv.set(key, true);
}
