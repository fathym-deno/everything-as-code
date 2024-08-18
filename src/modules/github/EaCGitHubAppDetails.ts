import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCGitHubAppDetails = {
  ProviderLookup: string;
} & EaCVertexDetails;

export function isEaCGitHubAppDetails(
  details: unknown,
): details is EaCGitHubAppDetails {
  const gitHubAppDetails = details as EaCGitHubAppDetails;

  return (
    gitHubAppDetails.ProviderLookup !== undefined &&
    typeof gitHubAppDetails.ProviderLookup === "string"
  );
}
