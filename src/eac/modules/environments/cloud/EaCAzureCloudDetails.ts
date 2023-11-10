import { EaCCloudDetails } from "./EaCCloudDetails.ts";

export type EaCAzureCloudDetails = {
  ApplicationID?: string | null;
  AuthKey?: string | null;
  SubscriptionID?: string | null;
  TenantID?: string | null;
} & EaCCloudDetails;
