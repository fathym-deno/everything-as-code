import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCCloudResourceGroupDetails = {
  Location?: string;

  Order?: number;
} & EaCVertexDetails;
