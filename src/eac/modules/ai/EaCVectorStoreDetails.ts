import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCVectorStoreDetails = {} & EaCVertexDetails;

export function isEaCVectorStoreDetails(
  details: unknown,
): details is EaCVectorStoreDetails {
  const vsDetails = details as EaCVectorStoreDetails;

  return !!vsDetails;
}
