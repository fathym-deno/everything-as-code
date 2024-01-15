import {
  createAzureOAuthConfig,
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

export function createAzureOAuth(
  envPrefix: string,
  redirectUri: string,
  scopes: string[],
): OAuthHelpers {
  return createHelpers(
    createAzureOAuthConfig({
      envPrefix,
      redirectUri,
      scope: scopes,
    }),
  );
}
