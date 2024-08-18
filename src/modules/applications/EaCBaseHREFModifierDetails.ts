import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCBaseHREFModifierDetails = {} & EaCModifierDetails<"BaseHREF">;

export function isEaCBaseHREFModifierDetails(
  details: unknown,
): details is EaCBaseHREFModifierDetails {
  const x = details as EaCBaseHREFModifierDetails;

  return (
    isEaCModifierDetails("BaseHREF", x)
  );
}
