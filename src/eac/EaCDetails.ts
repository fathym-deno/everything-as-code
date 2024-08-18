import { EaCMetadataBase } from "./EaCMetadataBase.ts";
import { EaCVertexDetails } from "./EaCVertexDetails.ts";

/**
 * Everything as Code (EaC) details.
 */
export type EaCDetails<TDetails extends EaCVertexDetails> = {
  /** The Details for the EaC node. */
  Details?: TDetails;
} & EaCMetadataBase;
