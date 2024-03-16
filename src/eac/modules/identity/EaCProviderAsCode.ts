import { EaCDetails } from "../../EaCDetails.ts";
import {
  EaCProviderDetails,
  isEaCProviderDetails,
} from "./EaCProviderDetails.ts";

export type EaCProviderAsCode = {
  DatabaseLookup: string;
} & EaCDetails<EaCProviderDetails>;

export function isEaCProviderAsCode(eac: unknown): eac is EaCProviderAsCode {
  const id = eac as EaCProviderAsCode;

  return (
    id &&
    isEaCProviderDetails(id.Details) &&
    id.DatabaseLookup !== undefined &&
    typeof id.DatabaseLookup === "string"
  );
}
