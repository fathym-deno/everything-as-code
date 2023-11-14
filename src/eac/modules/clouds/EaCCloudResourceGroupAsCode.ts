import { EaCCloudResourceGroupDetails } from "./EaCCloudResourceGroupDetails.ts";
import { EaCCloudResourceAsCode } from "./EaCCloudResourceAsCode.ts";
import { EaCDetails } from "../../EaCDetails.ts";

export type EaCCloudResourceGroupAsCode = {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
} & EaCDetails<EaCCloudResourceGroupDetails>;
