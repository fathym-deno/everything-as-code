import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCCloudResourceDetails = {
  Order: number;

  Type: "Format" | "Container";
} & EaCVertexDetails;
