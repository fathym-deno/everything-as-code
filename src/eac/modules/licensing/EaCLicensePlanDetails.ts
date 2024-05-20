import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCLicensePlanDetails = {
  Features: string[];

  Featured?: string;

  Priority: number;
} & EaCVertexDetails;
