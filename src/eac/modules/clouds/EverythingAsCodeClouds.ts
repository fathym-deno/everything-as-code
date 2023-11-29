import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCCloudAsCode } from "./EaCCloudAsCode.ts";

export type EverythingAsCodeClouds = {
  Clouds?: { [key: string]: EaCCloudAsCode } | null;
} & EaCMetadataBase;
