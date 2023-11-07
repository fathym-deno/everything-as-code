import { EaCMetadataBase } from "./EaCMetadataBase.ts";
import { EaCVertexDetails } from "./EaCVertexDetails.ts";

export type EaCDetails<TDetails extends EaCVertexDetails> = EaCMetadataBase & {
  Details?: TDetails | null;
};
