import {
  createAzureOAuthConfig,
  createGitHubOAuthConfig,
  createHelpers,
  getSessionId,
} from "$fresh/oauth";

export function createGitHubOAuth(scopes: string[]) {
  try {
    return createHelpers(
      createGitHubOAuthConfig({
        scope: scopes,
      }),
    );
  } catch (err) {
    return {};
  }
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
