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
): ClientSecretCredential {
  if (cloudLookup) {
    cloud = (cloud as EverythingAsCodeClouds).Clouds![cloudLookup];
  }

  const details = cloud.Details as EaCCloudAzureDetails;

  return new ClientSecretCredential(
    details.TenantID,
    details.ApplicationID,
    details.AuthKey,
  );
}
