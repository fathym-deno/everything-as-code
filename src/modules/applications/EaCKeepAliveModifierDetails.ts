import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCKeepAliveModifierDetails = {
  KeepAlivePath: string;
} & EaCModifierDetails<"KeepAlive">;

export function isEaCKeepAliveModifierDetails(
  details: unknown,
): details is EaCKeepAliveModifierDetails {
  const x = details as EaCKeepAliveModifierDetails;

  return (
    isEaCModifierDetails("KeepAlive", x) &&
    x.KeepAlivePath !== undefined &&
    typeof x.KeepAlivePath === "string"
  );
}
