import { EaCCloudDetails } from "./EaCCloudDetails.ts";
import { EaCLandingZoneAsCode } from "./EaCLandingZoneAsCode.ts";
import { EaCCloudResourceGroupAsCode } from "./EaCCloudResourceGroupAsCode.ts";
import { EaCDetails } from "../../EaCDetails.ts";

export type EaCCloudAsCode = {
  LandingZones?: Record<string, EaCLandingZoneAsCode>;

  ResourceGroups?: Record<string, EaCCloudResourceGroupAsCode>;

  Type?: "Azure";
} & EaCDetails<EaCCloudDetails>;
