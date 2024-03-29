import {
  createAzureAdb2cOAuthConfig,
  createAzureAdOAuthConfig,
  createGitHubOAuthConfig,
  createHelpers,
  OAuthHelpers,
} from "../deno.deps.ts";

export function createGitHubOAuth(scopes: string[]): OAuthHelpers {
  return createHelpers(
    createGitHubOAuthConfig({
      scope: scopes,
    }),
  );
}

export function createAzureADB2COAuth(
  scopes: string[],
  redirectUri?: string,
): OAuthHelpers {
  return createHelpers(
    createAzureAdb2cOAuthConfig({
      redirectUri,
      scope: scopes,
    }),
  );
}

export function createAzureADOAuth(
  scopes: string[],
  redirectUri?: string,
): OAuthHelpers {
  return createHelpers(
    createAzureAdOAuthConfig({
      redirectUri,
      scope: scopes,
    }),
  );
}
