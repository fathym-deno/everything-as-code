import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDatabaseDetails<TType = unknown> = {
  Type: TType;
} & EaCVertexDetails;

export function isEaCDatabaseDetails<TType = unknown>(
  type: TType,
  details: unknown,
): details is EaCDatabaseDetails {
  const dbDetails = details as EaCDatabaseDetails;

  return dbDetails && (!type || dbDetails.Type === type);
}
