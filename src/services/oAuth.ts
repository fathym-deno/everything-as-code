import {
  createAzureOAuthConfig,
  createGitHubOAuthConfig,
  createHelpers,
  getSessionId,
} from "$fresh/oauth";

export function createGitHubOAuth(scopes: string[]) {
  return createHelpers(
    createGitHubOAuthConfig({
      scope: scopes,
    }),
  );
}

export function createAzureOAuth(
  envPrefix: string,
  redirectUri: string,
  scopes: string[],
) {
  return createHelpers(
    createAzureOAuthConfig({
      envPrefix,
      redirectUri,
      scope: scopes,
    }),
  );
}
