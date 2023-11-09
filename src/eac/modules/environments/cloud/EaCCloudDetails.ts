import { EaCVertexDetails } from '../../../EaCVertexDetails.ts';

export type EaCCloudDetails = {
  ApplicationID?: string | null;
  AuthKey?: string | null;
  SubscriptionID?: string | null;
  TenantID?: string | null;
} & EaCVertexDetails;
