import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCMarkdownModifierDetails = {
  TraceRequest: boolean;

  TraceResponse: boolean;
} & EaCModifierDetails;

export function isEaCMarkdownModifierDetails(
  details: unknown,
): details is EaCMarkdownModifierDetails {
  const kvDetails = details as EaCMarkdownModifierDetails;

  return (
    isEaCModifierDetails(kvDetails) &&
    kvDetails.TraceRequest !== undefined &&
    typeof kvDetails.TraceRequest === "boolean" &&
    kvDetails.TraceResponse !== undefined &&
    typeof kvDetails.TraceResponse === "boolean"
  );
}
