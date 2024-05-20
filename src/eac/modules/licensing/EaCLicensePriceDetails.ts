import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCLicensePriceDetails = {
  Currency: string;

  Discount: number;

  Interval: string;

  Name: string;

  Value: number;
} & EaCVertexDetails;
