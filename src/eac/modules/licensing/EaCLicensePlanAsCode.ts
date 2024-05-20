import { EaCDetails } from "../../EaCDetails.ts";
import { EaCLicensePlanDetails } from "./EaCLicensePlanDetails.ts";
import { EaCLicensePriceAsCode } from "./EaCLicensePriceAsCode.ts";

export type EaCLicensePlanAsCode = {
  Prices: Record<string, EaCLicensePriceAsCode>;
} & EaCDetails<EaCLicensePlanDetails>;
