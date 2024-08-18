import { SecretClient } from "./.deps.ts";

/**
 * This function retrieves secrets from Azure Key Vault.
 *
 * @param secretClient The SecretClient to use for retrieving secrets.
 * @param toSecrets The secrets to retrieve from Key Vault.
 * @returns The retrieved secrets.
 */
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
