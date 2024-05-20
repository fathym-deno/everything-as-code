import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCStripeModifierDetails = {
  LicenseLookup: string;

  IncludeScript: boolean;
} & EaCModifierDetails<"Stripe">;

export function isEaCStripeModifierDetails(
  details: unknown,
): details is EaCStripeModifierDetails {
  const x = details as EaCStripeModifierDetails;

  return (
    isEaCModifierDetails("Stripe", x) &&
    x.IncludeScript !== undefined &&
    typeof x.IncludeScript === "boolean"
  );
}
