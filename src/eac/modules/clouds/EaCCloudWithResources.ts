import { EaCCloudResourceAsCode } from "./EaCCloudResourceAsCode.ts";

export type EaCCloudWithResources = {
  Resources?: { [key: string]: EaCCloudResourceAsCode };
};
