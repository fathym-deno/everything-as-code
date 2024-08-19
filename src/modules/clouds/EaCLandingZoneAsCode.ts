import { EaCDetails } from "../../eac/EaCDetails.ts";
import { EaCLandingZoneDetails } from "./EaCLandingZoneDetails.ts";
import { EaCLaunchPadAsCode } from "./EaCLaunchPadAsCode.ts";

export type EaCLandingZoneAsCode = {
  LaunchPads?: Record<string, EaCLaunchPadAsCode>;
} & EaCDetails<EaCLandingZoneDetails>;
