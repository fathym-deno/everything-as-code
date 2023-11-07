import { EaCVertexDetails } from "../../../EaCVertexDetails.ts";

export type EaCCloudDetails = EaCVertexDetails & {
  ApplicationID?: string | null;
  AuthKey?: string | null;
  SubscriptionID?: string | null;
  TenantID?: string | null;
};
