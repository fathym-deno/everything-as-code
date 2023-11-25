import { EaCDetails } from "../../EaCDetails.ts";
import { EaCCloudResourceDetails } from "./EaCCloudResourceDetails.ts";
import { EaCCloudWithResources } from "./EaCCloudWithResources.ts";

export type EaCCloudResourceAsCode =
  & {
    Type?: "Format" | "Container";
  }
  & EaCCloudWithResources
  & EaCDetails<EaCCloudResourceDetails>;
