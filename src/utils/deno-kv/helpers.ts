import { AtomicOperationHandler } from "./AtomicOperationHandler.ts";
import { DenoKVNonce } from "./DenoKVNonce.ts";

export async function hasKvEntry(
  denoKv: Deno.Kv,
  key: Deno.KvKey,
): Promise<boolean> {
  try {
    const entry = await denoKv.get(key);

    return !!entry?.value;
  } catch (err) {
    console.error(err);

    return false;
  }
}

export async function enqueueAtomic(
  queueKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler?: AtomicOperationHandler,
  opKv?: Deno.Kv,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  msg.nonce = crypto.randomUUID();

  if (!opKv) {
    opKv = queueKv;
  }

  let atomic = enqueueAtomicOperation(queueKv.atomic(), msg);

  if (atomicOpHandler) {
    if (opKv !== queueKv) {
      const opAtomic = atomicOpHandler(opKv.atomic());

      await opAtomic.commit();
    } else {
      atomic = atomicOpHandler(atomic);
    }
  }

  return await atomic.commit();
}

export function enqueueAtomicOperation(
  op: Deno.AtomicOperation,
  msg: DenoKVNonce,
  delay?: number,
): Deno.AtomicOperation {
  msg.nonce = crypto.randomUUID();

  op.check({ key: ["nonces", msg.nonce], versionstamp: null })
    .enqueue(msg, { delay })
    .set(["nonces", msg.nonce], true)
    .sum(["enqueued_count"], 1n);

  return op;
}

export async function listenQueueAtomic(
  queueKv: Deno.Kv,
  msg: DenoKVNonce,
  atomicOpHandler: AtomicOperationHandler,
  opKv?: Deno.Kv,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  if (!msg.nonce) {
    throw new Error(`The message is required to have a nonce value.`);
  }

  if (!opKv) {
    opKv = queueKv;
  }

  const nonce = await queueKv.get<DenoKVNonce>(["nonces", msg.nonce]);

  let atomic = queueKv
    .atomic()
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n);

  if (opKv !== queueKv) {
    const opAtomic = atomicOpHandler(opKv.atomic());

    await opAtomic.commit();
  } else {
    atomic = atomicOpHandler(atomic);
  }

  return await atomic.commit();
}
