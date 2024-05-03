import { ClientSecretCredential, TokenCredential } from "npm:@azure/identity";
import { ConfidentialClientApplication } from "npm:@azure/msal-node";
import {
  EaCCloudAsCode,
  isEaCCloudAsCode,
} from "../../eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCCloudAzureDetails } from "../../eac/modules/clouds/EaCCloudAzureDetails.ts";
import { EverythingAsCodeClouds } from "../../eac/modules/clouds/EverythingAsCodeClouds.ts";
import { deconstructCloudDetailsSecrets } from "./helpers.ts";
import { EaCCloudDetails } from "../../eac/modules/clouds/EaCCloudDetails.ts";
import { EverythingAsCode } from "../../eac/EverythingAsCode.ts";
import { AccessToken } from "../../../../../../../AppData/Local/deno/npm/registry.npmjs.org/@azure/core-auth/1.7.2/dist/esm/index.d.ts";

export async function loadAzureCredentialsForToken(
  token: string,
): Promise<TokenCredential> {
  return {
    getToken: () => {
      return Promise.resolve({
        token: token,
      } as AccessToken);
    },
  };
}

export async function loadAzureCredentialsForIDToken(
  idToken: string,
  clientId: string,
  clientSecret: string,
  scopes: string[],
  tenantId: string = "common",
): Promise<TokenCredential> {
  const cca = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
  });

  const authResult = await cca.acquireTokenOnBehalfOf({
    oboAssertion: idToken,
    scopes: scopes,
  });

  if (authResult?.accessToken) {
    return {
      getToken: () => {
        return Promise.resolve({
          token: authResult.accessToken,
        } as AccessToken);
      },
    };
  } else {
    throw new Error("Failed to obtain access token");
  }
}

export async function loadAzureCloudCredentials(
  entLookup: string,
  cloudLookup: string,
  loadEac: (entLookup: string) => Promise<EverythingAsCode>,
): Promise<TokenCredential>;

export async function loadAzureCloudCredentials(
  eac: EverythingAsCodeClouds,
  cloudLookup: string,
): Promise<TokenCredential>;

export async function loadAzureCloudCredentials(
  cloud: EaCCloudAsCode,
): Promise<TokenCredential>;

export async function loadAzureCloudCredentials(
  cloudDetails: EaCCloudDetails,
): Promise<TokenCredential>;

export async function loadAzureCloudCredentials(
  cloudDetailsEaCEntLookup:
    | EverythingAsCodeClouds
    | EaCCloudAsCode
    | EaCCloudDetails
    | string,
  cloudLookup?: string,
  loadEaC?: (entLookup: string) => Promise<EverythingAsCode>,
): Promise<TokenCredential> {
  let cloud: EaCCloudAsCode;

  if (cloudLookup) {
    let eac: EverythingAsCodeClouds;

    if (typeof cloudDetailsEaCEntLookup === "string") {
      eac = await loadEaC!(cloudDetailsEaCEntLookup);
    } else {
      eac = cloudDetailsEaCEntLookup as EverythingAsCodeClouds;
    }

    cloud = eac.Clouds![cloudLookup];
  } else if (isEaCCloudAsCode(cloudDetailsEaCEntLookup)) {
    cloud = cloudDetailsEaCEntLookup as EaCCloudAsCode;
  } else {
    cloud = {
      Details: cloudDetailsEaCEntLookup as EaCCloudDetails,
    };
  }

  if ("Token" in cloud) {
    return loadAzureCredentialsForToken(cloud.Token as string);
  } else {
    const details = (await deconstructCloudDetailsSecrets(
      cloud.Details,
    )) as EaCCloudAzureDetails;

    return new ClientSecretCredential(
      details.TenantID,
      details.ApplicationID,
      details.AuthKey,
    );
  }
}

export function loadMainAzureCredentials(): ClientSecretCredential {
  return new ClientSecretCredential(
    Deno.env.get("AZURE_TENANT_ID")!,
    Deno.env.get("AZURE_CLIENT_ID")!,
    Deno.env.get("AZURE_CLIENT_SECRET")!,
  );
}
