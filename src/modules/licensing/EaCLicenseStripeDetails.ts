import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCLicenseStripeDetails = {
  Enabled: boolean;

  PublishableKey: string;

  SecretKey: string;

  WebhookSecret: string;
} & EaCVertexDetails;
