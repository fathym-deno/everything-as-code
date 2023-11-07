import { EaCDetails } from "../../../EaCDetails.ts";
import { EaCCloudResourceDetails } from "./EaCCloudResourceDetails.ts";

export type EaCCloudResourceAsCode = EaCDetails<EaCCloudResourceDetails> & {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
};
