import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCEnvironmentAsCode } from "./EaCEnvironmentAsCode.ts";

export type EverythingAsCodeEnvironments = EaCMetadataBase & {
  Environments?: { [key: string]: EaCEnvironmentAsCode };
};
