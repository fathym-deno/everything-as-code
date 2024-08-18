import { EaCMetadataBase } from "./EaCMetadataBase.ts";

/**
 * Details about a vertex in the Everything as Code (EaC) graph.
 */
export type EaCVertexDetails = {
  /** The description of the vertex. */
  Description?: string | null;

  /** The name of the vertex. */
  Name?: string | null;
} & EaCMetadataBase;
