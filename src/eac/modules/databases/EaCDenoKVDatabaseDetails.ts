import {
  EaCDatabaseDetails,
  isEaCDatabaseDetails,
} from "./EaCDatabaseDetails.ts";

export type EaCDenoKVDatabaseDetails = {
  DenoKVPath: string;
} & EaCDatabaseDetails;

export function isEaCDenoKVDatabaseDetails(
  details: unknown,
): details is EaCDenoKVDatabaseDetails {
  const kvDetails = details as EaCDenoKVDatabaseDetails;

  return (
    isEaCDatabaseDetails(kvDetails) &&
    kvDetails.DenoKVPath !== undefined &&
    typeof kvDetails.DenoKVPath === "string"
  );
}
