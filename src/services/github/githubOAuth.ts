import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";

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
