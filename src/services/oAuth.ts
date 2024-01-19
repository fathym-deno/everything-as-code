import {
  createAzureADB2COAuthConfig,
  createAzureADOAuthConfig,
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
  redirectUri: string,
  scopes: string[],
): OAuthHelpers {
  return createHelpers(
    createAzureADB2COAuthConfig({
      redirectUri,
      scope: scopes,
    }),
  );
}

export function createAzureADOAuth(
  redirectUri: string,
  scopes: string[],
): OAuthHelpers {
  return createHelpers(
    createAzureADOAuthConfig({
      redirectUri,
      scope: scopes,
    }),
  );
}
