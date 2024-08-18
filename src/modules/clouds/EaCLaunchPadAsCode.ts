import { EaCDetails } from "../../eac/EaCDetails.ts";
import { EaCLaunchPadDetails } from "./EaCLaunchPadDetails.ts";
import { EaCOverhaulAsCode } from "./EaCOverhaulAsCode.ts";

export type EaCLaunchPadAsCode = {
  Overhauls?: Record<string, EaCOverhaulAsCode> | null;
} & EaCDetails<EaCLaunchPadDetails>;
