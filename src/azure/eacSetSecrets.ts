import { SecretClient } from "../../../../../../Users/diana/AppData/Local/deno/npm/registry.npmjs.org/@azure/keyvault-secrets/4.8.0/types/keyvault-secrets";
import { kebabCase } from "./.deps.ts";

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
        ? kebabCase(`${secretRoot}-${secret}`)
        : kebabCase(secret);

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
