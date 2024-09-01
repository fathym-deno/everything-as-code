import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDatabaseDetails<TType = string> = {
  Type: TType;
} & EaCVertexDetails;

export function isEaCDatabaseDetails<TType = unknown>(
  type: TType,
  details: unknown,
): details is EaCDatabaseDetails<TType> {
  const x = details as EaCDatabaseDetails<TType>;

  return x && (!type || x.Type === type);
}
