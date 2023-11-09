import { EaCDetails } from "../../../EaCDetails.ts";
import { EaCLaunchPadDetails } from "./EaCLaunchPadDetails.ts";
import { EaCOverhaulAsCode } from "./EaCOverhaulAsCode.ts";

export type EaCLaunchPadAsCode = {
  Overhauls?: { [key: string]: EaCOverhaulAsCode } | null;
} & EaCDetails<EaCLaunchPadDetails>;
