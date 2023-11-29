import { EaCCloudAsCode } from "../../eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCCloudAzureDetails } from "../../eac/modules/clouds/EaCCloudAzureDetails.ts";
import { EverythingAsCodeClouds } from "../../eac/modules/clouds/EverythingAsCodeClouds.ts";
import { ClientSecretCredential } from "npm:@azure/identity";

export function loadAzureCloudCredentials(
  eac: EverythingAsCodeClouds,
  cloudLookup: string,
): ClientSecretCredential;

export function loadAzureCloudCredentials(
  cloud: EaCCloudAsCode,
): ClientSecretCredential;

export function loadAzureCloudCredentials(
  cloud: EverythingAsCodeClouds | EaCCloudAsCode,
  cloudLookup?: string,
): ClientSecretCredential | undefined {
  if (cloudLookup) {
    cloud = (cloud as EverythingAsCodeClouds).Clouds![cloudLookup];
  }

  const details = cloud.Details as EaCCloudAzureDetails;

  return details
    ? new ClientSecretCredential(
      details.TenantID,
      details.ApplicationID,
      details.AuthKey,
    )
    : undefined;
}

export function loadMainAzureCredentials(): ClientSecretCredential {
  return new ClientSecretCredential(
    "6dcbebd0-f8d0-4a9d-89e5-5873e8146b0a",
    "0d757bb5-3dbb-4f8f-8c89-12e8714aa7c5",
    "Kci8Q~uvZHTb~XFRdly2VL1XSZq1rNgmS3PL~aE4",
  );
}
