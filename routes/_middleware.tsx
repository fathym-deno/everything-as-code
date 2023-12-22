import { getCookies, setCookie } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";
import { fathymDenoKv } from "../configs/deno-kv.config.ts";
import { redirectRequest } from "@fathym/common";
import { UserGitHubConnection } from "../src/github/UserGitHubConnection.ts";
import { gitHubOAuth } from "../src/services/github.ts";
import { EaCSourceConnectionDetails } from "../src/eac/modules/sources/EaCSourceConnectionDetails.ts";
import { loadMainOctokit } from "../src/services/github/octokit/load.ts";

async function loggedInCheck(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);

  const { origin, pathname, search, searchParams } = url;

  if (origin.endsWith("ngrok-free.app")) {
    return redirectRequest(`http://localhost:5437${pathname}${search}`);
  }

  if (pathname.startsWith("/dashboard")) {
    return ctx.next();
  }

  switch (pathname) {
    case "/signin": {
      return await gitHubOAuth.signIn(req);
    }

    case "/signin/callback": {
      const { response, tokens, sessionId } = await gitHubOAuth.handleCallback(
        req,
      );

      const { accessToken, refreshToken } = tokens;

      const octokit = await loadMainOctokit({
        Token: accessToken,
      } as EaCSourceConnectionDetails);

      const { data: { login } } = await octokit.rest.users
        .getAuthenticated();

      const { data } = await octokit.rest.users
        .listEmailsForAuthenticatedUser();

      const primaryEmail = data.find((e) => e.primary);

      const oldSessionId = await gitHubOAuth.getSessionId(req);

      if (oldSessionId) {
        await fathymDenoKv.delete([
          "User",
          "Session",
          oldSessionId!,
          "Username",
        ]);
      }

      await fathymDenoKv.set(
        ["User", "Session", sessionId!, "Username"],
        primaryEmail!.email,
      );

      await fathymDenoKv.set(
        ["User", "Session", sessionId!, "GitHub", "GitHubConnection"],
        {
          RefreshToken: refreshToken,
          Token: accessToken,
          Username: login,
        } as UserGitHubConnection,
      );

      return response;
    }

    case "/signout": {
      return await gitHubOAuth.signOut(req);
    }

    default: {
      return ctx.next();
    }
  }
}

export const handler = [loggedInCheck];
