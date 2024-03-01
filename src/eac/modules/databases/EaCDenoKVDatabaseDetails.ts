import {
  EaCDatabaseDetails,
  isEaCDatabaseDetails,
} from "./EaCDatabaseDetails.ts";

export type EaCDenoKVDatabaseDetails = {
  DenoKVPath?: string;
} & EaCDatabaseDetails<"DenoKV">;

export function isEaCDenoKVDatabaseDetails(
  details: unknown,
): details is EaCDenoKVDatabaseDetails {
  const kvDetails = details as EaCDenoKVDatabaseDetails;

  return (
    isEaCDatabaseDetails("DenoKV", kvDetails) &&
    kvDetails.Type !== undefined &&
    kvDetails.Type === "DenoKV"
  );
}
