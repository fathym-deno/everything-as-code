import { EaCDetails } from "../../EaCDetails.ts";
import { EaCDashboardAsCode } from "./EaCDashboardAsCode.ts";
import { EaCDeviceAsCode } from "./EaCDeviceAsCode.ts";
import { EaCIoTDetails } from "./EaCIoTDetails.ts";

export type EaCIoTAsCode = {
  CloudLookup: string;

  Dashboards?: { [key: string]: EaCDashboardAsCode } | null;

  Devices?: { [key: string]: EaCDeviceAsCode } | null;

  ResourceGroupLookup: string;
} & EaCDetails<EaCIoTDetails>;
