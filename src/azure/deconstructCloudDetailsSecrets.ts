import {
  EaCCloudAzureDetails,
  isEaCCloudAzureDetails,
} from "../modules/clouds/EaCCloudAzureDetails";
import { EaCCloudDetails } from "../modules/clouds/EaCCloudDetails";
import { eacGetSecrets } from "./helpers";
import { loadMainSecretClient } from "./key-vault";

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
