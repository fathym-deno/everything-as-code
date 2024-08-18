import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCJWTValidationModifierDetails =
  & {}
  & EaCModifierDetails<"JWTValidation">;

export function isEaCJWTValidationModifierDetails(
  details: unknown,
): details is EaCJWTValidationModifierDetails {
  const x = details as EaCJWTValidationModifierDetails;

  return (
    isEaCModifierDetails("JWTValidation", x)
  );
}
