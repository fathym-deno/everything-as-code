import { EaCDetails } from "../../EaCDetails.ts";
import { EaCDeviceAsCode } from "./EaCDeviceAsCode.ts";
import { EaCIoTDetails } from "./EaCIoTDetails.ts";

export type EaCIoTAsCode = {
  CloudLookup: string;

  Devices?: { [key: string]: EaCDeviceAsCode } | null;

  ResourceGroupLookup: string;
} & EaCDetails<EaCIoTDetails>;
