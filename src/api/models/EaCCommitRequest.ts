import { EverythingAsCode } from "../../EverythingAsCode.ts";
import { DenoKVNonce } from "../../utils/deno-kv/DenoKVNonce.ts";

export type EaCCommitRequest = DenoKVNonce & {
  EaC: EverythingAsCode;

  Username: string;
};

export function isEaCCommitRequest(req: unknown): req is EaCCommitRequest {
  const commitRequest = req as EaCCommitRequest;

  return (
    commitRequest.EaC !== undefined &&
    typeof commitRequest.EaC.EnterpriseLookup === "string"
  );
}
