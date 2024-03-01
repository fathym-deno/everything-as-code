import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCModifierDetails<TType = unknown> = {
  Type: TType;
} & EaCVertexDetails;

export function isEaCModifierDetails<TType = unknown>(
  type: TType,
  details: unknown,
): details is EaCModifierDetails {
  const x = details as EaCModifierDetails;

  return x && (!type || x.Type === type);
}
