import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCDenoKVCacheModifierDetails = {
  CacheSeconds: number;

  DenoKVDatabaseLookup: string;

  PathFilterRegex?: string;
} & EaCModifierDetails<"DenoKVCache">;

export function isEaCDenoKVCacheModifierDetails(
  details: unknown,
): details is EaCDenoKVCacheModifierDetails {
  const x = details as EaCDenoKVCacheModifierDetails;

  return (
    isEaCModifierDetails("DenoKVCache", x) &&
    x.CacheSeconds !== undefined &&
    typeof x.CacheSeconds === "number" &&
    x.DenoKVDatabaseLookup !== undefined &&
    typeof x.DenoKVDatabaseLookup === "string"
  );
}
