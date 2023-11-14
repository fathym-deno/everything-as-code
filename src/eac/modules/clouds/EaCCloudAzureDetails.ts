import { EaCCloudDetails } from "./EaCCloudDetails.ts";

export type EaCCloudAzureDetails = {
  ApplicationID: string;

  AuthKey: string;

  SubscriptionID: string;

  TenantID: string;
} & EaCCloudDetails;
