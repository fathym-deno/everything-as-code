import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDatabaseDetails<TType extends string | undefined = string> = {
  Type: TType;
} & EaCVertexDetails;

export function isEaCDatabaseDetails<TType extends string | undefined = string>(
  type: TType,
  details: unknown,
): details is EaCDatabaseDetails<TType> {
  const x = details as EaCDatabaseDetails<TType>;

  return x && (!type || x.Type === type);
}
