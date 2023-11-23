import { EaCCloudDetails } from "./EaCCloudDetails.ts";

export type EaCCloudAzureDetails = {
  ApplicationID: string;

  AuthKey: string;

  ID?: string;

  SubscriptionID: string;

  TenantID: string;
} & EaCCloudDetails;
