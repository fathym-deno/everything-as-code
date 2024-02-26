import { merge, paramCase } from "../../src.deps.ts";
import { SecretClient } from "npm:@azure/keyvault-secrets";
import { hasKvEntry, waitOnProcessing } from "../deno-kv/helpers.ts";
import {
  EaCCloudAzureDetails,
  isEaCCloudAzureDetails,
} from "../../eac/modules/clouds/EaCCloudAzureDetails.ts";
import { loadMainSecretClient } from "../../services/azure/key-vault.ts";
import { EaCCloudDetails } from "../../eac/modules/clouds/EaCCloudDetails.ts";

export async function deconstructCloudDetailsSecrets(
  details: EaCCloudDetails | undefined,
): Promise<EaCCloudDetails | undefined> {
  let cloudDetails = details;

  if (details) {
    const secretClient = await loadMainSecretClient();

    if (isEaCCloudAzureDetails(cloudDetails)) {
      const secreted = await eacGetSecrets(secretClient, {
        AuthKey: cloudDetails.AuthKey,
      });

      cloudDetails = {
        ...details,
        ...secreted,
      } as EaCCloudAzureDetails;
    }
  }

  return cloudDetails;
}

export async function eacGetSecrets(
  secretClient: SecretClient,
  toSecrets: Record<string, string>,
): Promise<Record<string, string>> {
  const secreted: Record<string, string> = {};

  const secrets = Object.keys(toSecrets || {});

  const calls = secrets.map((secret) => {
    return new Promise((resolve, reject) => {
      let toSecret = toSecrets[secret];

      if (toSecret && toSecret.startsWith("$secret:")) {
        try {
          const secretName = toSecret.replace("$secret:", "");

          secretClient.getSecret(secretName).then((response) => {
            secreted[secret] = response.value!;

            resolve(secreted[secret]);
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        resolve(toSecret);
      }
    });
  });

  await Promise.all(calls);

  return secreted;
}

export async function eacSetSecrets(
  secretClient: SecretClient,
  secretRoot: string,
  toSecrets: Record<string, string | undefined>,
): Promise<Record<string, string>> {
  const secreted: Record<string, string> = {};

  const secrets = Object.keys(toSecrets || {});

  const calls = secrets.map((secret) => {
    return new Promise((resolve, reject) => {
      const secretName = secretRoot
        ? paramCase(`${secretRoot}-${secret}`)
        : paramCase(secret);

      let toSecret = toSecrets[secret];

      if (toSecret && !toSecret.startsWith("$secret:")) {
        try {
          secretClient
            .setSecret(secretName, toSecret as string)
            .then((response) => {
              secreted[secret] = `$secret:${secretName}`;

              resolve(secreted[secret]);
            });
        } catch (err) {
          console.error(err);
        }
      } else {
        resolve(toSecret);
      }
    });
  });

  await Promise.all(calls);

  return secreted;
}
