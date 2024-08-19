import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCDevOpsActionDetails = {
  Path?: string;

  Templates?: string[];
} & EaCVertexDetails;
