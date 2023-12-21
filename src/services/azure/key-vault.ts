import { KeyClient } from "npm:@azure/keyvault-keys";
import { SecretClient } from "npm:@azure/keyvault-secrets";
import { TokenCredential } from "npm:@azure/identity";
import {
  loadAzureCloudCredentials,
  loadMainAzureCredentials,
} from "../../utils/eac/loadAzureCloudCredentials.ts";
import {
  EverythingAsCodeClouds,
  isEverythingAsCodeClouds,
} from "../../eac/modules/clouds/EverythingAsCodeClouds.ts";
import { denoKv } from "../../../configs/deno-kv.config.ts";

export async function loadKeyClient(
  entLookup: string,
  cloudLookup: string,
  keyVaultLookup: string,
): Promise<KeyClient>;

export async function loadKeyClient(
  eac: EverythingAsCodeClouds,
  cloudLookup: string,
  keyVaultLookup: string,
): Promise<KeyClient>;

export async function loadKeyClient(
  creds: TokenCredential,
  keyVaultLookup: string,
): Promise<KeyClient>;

export async function loadKeyClient(
  credsEaCEntLookup: string | TokenCredential | EverythingAsCodeClouds,
  keyVaultCloudLookup: string,
  keyVaultLookup?: string,
): Promise<KeyClient> {
  const { creds, url } = await loadKeyVaultUrlAndCreds(
    credsEaCEntLookup,
    keyVaultCloudLookup,
    keyVaultLookup,
  );

  return new KeyClient(url, creds);
}

export async function loadMainKeyClient(
  keyVaultLookup: string,
): Promise<KeyClient> {
  const creds = loadMainAzureCredentials();

  return await loadKeyClient(creds, keyVaultLookup);
}

export async function loadSecretClient(
  entLookup: string,
  cloudLookup: string,
  keyVaultLookup: string,
): Promise<SecretClient>;

export async function loadSecretClient(
  eac: EverythingAsCodeClouds,
  cloudLookup: string,
  keyVaultLookup: string,
): Promise<SecretClient>;

export async function loadSecretClient(
  creds: TokenCredential,
  keyVaultLookup: string,
): Promise<SecretClient>;

export async function loadSecretClient(
  credsEaCEntLookup: string | TokenCredential | EverythingAsCodeClouds,
  keyVaultCloudLookup: string,
  keyVaultLookup?: string,
): Promise<SecretClient> {
  const { creds, url } = await loadKeyVaultUrlAndCreds(
    credsEaCEntLookup,
    keyVaultCloudLookup,
    keyVaultLookup,
  );

  return new SecretClient(url, creds);
}

export async function loadMainSecretClient(): Promise<SecretClient>;

export async function loadMainSecretClient(
  keyVaultLookup?: string,
): Promise<SecretClient> {
  if (!keyVaultLookup) {
    keyVaultLookup = Deno.env.get("AZURE_KEY_VAULT_NAME")!;
  }

  const creds = loadMainAzureCredentials();

  return await loadSecretClient(creds, keyVaultLookup);
}

export async function loadKeyVaultUrlAndCreds(
  credsEaCEntLookup: string | TokenCredential | EverythingAsCodeClouds,
  keyVaultCloudLookup: string,
  keyVaultLookup?: string,
): Promise<{
  creds: TokenCredential;

  url: string;
}> {
  let creds: TokenCredential | undefined;

  if (typeof credsEaCEntLookup === "string") {
    const existingEaC = await denoKv.get<EverythingAsCodeClouds>([
      "EaC",
      credsEaCEntLookup,
    ]);

    creds = await loadAzureCloudCredentials(
      existingEaC.value!,
      keyVaultCloudLookup,
    );
  } else if (isEverythingAsCodeClouds(credsEaCEntLookup)) {
    creds = await loadAzureCloudCredentials(
      credsEaCEntLookup,
      keyVaultCloudLookup,
    );
  } else {
    creds = credsEaCEntLookup;
  }

  if (!keyVaultLookup) {
    keyVaultLookup = keyVaultCloudLookup;
  }

  const url = `https://${keyVaultLookup}.vault.azure.net/`;

  return { creds, url };
}
