import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCIoTAsCode } from "./EaCIoTAsCode.ts";

export type EverythingAsCodeIoT = {
  IoT?: {
    [key: string]: EaCIoTAsCode;
  };
} & EaCMetadataBase;
