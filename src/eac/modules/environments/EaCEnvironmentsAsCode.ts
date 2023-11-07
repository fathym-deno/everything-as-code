import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCEnvironmentAsCode } from "./EaCEnvironmentAsCode.ts";

export type EaCEnvironmentsAsCode = EaCMetadataBase & {
  Environments?: { [key: string]: EaCEnvironmentAsCode };
};
