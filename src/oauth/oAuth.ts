import { OAuthHelpers } from "../src.deps.ts";
import {
  createAzureAdb2cOAuthConfig,
  createAzureAdOAuthConfig,
  createGitHubOAuthConfig,
  createHelpers,
  getSessionId,
  SignInOptions,
  Tokens,
} from "$fresh/oauth";

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