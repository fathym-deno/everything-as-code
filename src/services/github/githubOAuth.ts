import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";

export function createGitHubOAuth(scopes: string[]) {
  return createHelpers(
    createGitHubOAuthConfig({
      scope: scopes,
    }),
  );
}
