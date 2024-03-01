import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCOAuthModifierDetails = {
  ProviderLookup: string;

  SignInPath: string;
} & EaCModifierDetails<"OAuth">;

export function isEaCOAuthModifierDetails(
  details: unknown,
): details is EaCOAuthModifierDetails {
  const x = details as EaCOAuthModifierDetails;

  return (
    isEaCModifierDetails("OAuth", x) &&
    x.ProviderLookup !== undefined &&
    typeof x.ProviderLookup === "string" &&
    x.SignInPath !== undefined &&
    typeof x.SignInPath === "string"
  );
}
