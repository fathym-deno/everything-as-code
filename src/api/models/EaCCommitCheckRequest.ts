import { DenoKVNonce } from "../../utils/deno-kv/DenoKVNonce.ts";
import { EaCCommitRequest } from "./EaCCommitRequest.ts";
import { EaCHandlerCheckRequest } from "./EaCHandlerCheckRequest.ts";

export type EaCCommitCheckRequest =
  & {
    Checks: EaCHandlerCheckRequest[];
  }
  & EaCCommitRequest;

export function isEaCCommitCheckRequest(
  req: unknown,
): req is EaCCommitCheckRequest {
  const commitRequest = req as EaCCommitCheckRequest;

  return (
    commitRequest.Checks !== undefined &&
    Array.isArray(commitRequest.Checks)
  );
}