import { denoKv } from "../../../configs/deno-kv.config.ts";
import { EaCCloudAsCode } from "../../eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCCloudAzureDetails } from "../../eac/modules/clouds/EaCCloudAzureDetails.ts";
import { EverythingAsCodeClouds } from "../../eac/modules/clouds/EverythingAsCodeClouds.ts";
import { ClientSecretCredential } from "npm:@azure/identity";

export async function loadAzureCloudCredentials(
  entLookup: string,
  cloudLookup: string,
): Promise<ClientSecretCredential>;

export async function loadAzureCloudCredentials(
  eac: EverythingAsCodeClouds,
  cloudLookup: string,
): Promise<ClientSecretCredential>;

export async function loadAzureCloudCredentials(
  cloud: EaCCloudAsCode,
): Promise<ClientSecretCredential>;

export async function loadAzureCloudCredentials(
  cloudEaCEntLookup: EverythingAsCodeClouds | EaCCloudAsCode | string,
  cloudLookup?: string,
): Promise<ClientSecretCredential> {
  let cloud: EaCCloudAsCode;

  if (cloudLookup) {
    let eac: EverythingAsCodeClouds;

    if (typeof cloudEaCEntLookup === "string") {
      const existingEaC = await denoKv.get<EverythingAsCodeClouds>([
        "EaC",
        cloudEaCEntLookup,
      ]);

      eac = existingEaC.value!;
    } else {
      eac = cloudEaCEntLookup as EverythingAsCodeClouds;
    }

    cloud = eac.Clouds![cloudLookup];
  } else {
    cloud = cloudEaCEntLookup as EaCCloudAsCode;
  }

  const details = cloud.Details as EaCCloudAzureDetails;

  return new ClientSecretCredential(
    details.TenantID,
    details.ApplicationID,
    details.AuthKey,
  );
}

export function loadMainAzureCredentials(): ClientSecretCredential {
  return new ClientSecretCredential(
    Deno.env.get("AZURE_TENANT_ID")!,
    Deno.env.get("AZURE_CLIENT_ID")!,
    Deno.env.get("AZURE_CLIENT_SECRET")!,
  );
}
