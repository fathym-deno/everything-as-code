import { DenoKVNonce } from "../../utils/deno-kv/DenoKVNonce.ts";

export type EaCDeleteRequest = DenoKVNonce & {
  Archive: boolean;

  EnterpriseLookup: string;

  Username: string;
};

export function isEaCDeleteRequest(req: unknown): req is EaCDeleteRequest {
  const deleteRequest = req as EaCDeleteRequest;

  return (
    deleteRequest.EnterpriseLookup !== undefined &&
    typeof deleteRequest.EnterpriseLookup === "string" &&
    typeof deleteRequest.Archive === "boolean"
  );
}
