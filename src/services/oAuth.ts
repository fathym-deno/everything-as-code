import {
  createAzureAdb2cOAuthConfig,
  createAzureAdOAuthConfig,
  createGitHubOAuthConfig,
  createHelpers,
  getSessionId,
  SignInOptions,
  Tokens,
} from "$fresh/oauth";

export type OAuthHelpers = {
  signIn(request: Request, options?: SignInOptions): Promise<Response>;

  handleCallback(request: Request): Promise<{
    response: Response;
    sessionId: string;
    tokens: Tokens;
  }>;

  signOut(request: Request): Promise<Response>;

  getSessionId(request: Request): Promise<string | undefined>;
};

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
