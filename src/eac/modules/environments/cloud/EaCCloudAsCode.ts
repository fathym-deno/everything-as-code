import { EaCCloudDetails } from "./EaCCloudDetails.ts";
import { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode.ts";
import { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode.ts";
import { EaCDetails } from "../../../EaCDetails.ts";

export type EaCCloudAsCode = EaCDetails<EaCCloudDetails> & {
  LandingZones?: Record<string, EaCLandingZoneAsCode>;

  ResourceGroups?: Record<string, EaCCloudResourceGroupAsCode>;

  Type?: string;
};
