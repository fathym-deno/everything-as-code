import { SecretClient } from "../../../../../../Users/diana/AppData/Local/deno/npm/registry.npmjs.org/@azure/keyvault-secrets/4.8.0/types/keyvault-secrets";

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
