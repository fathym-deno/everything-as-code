import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";
import { redirectRequest } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { UserGitHubConnection } from "../../src/github/UserGitHubConnection.ts";
import { gitHubOAuth } from "../../src/services/github.ts";
import { loadMainOctokit } from "../../src/services/github/octokit/load.ts";
import { EaCSourceConnectionDetails } from "../../src/eac/modules/sources/EaCSourceConnectionDetails.ts";

async function loggedInCheck(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);

  const { origin, pathname, search, searchParams } = url;

  if (origin.endsWith("ngrok-free.app")) {
    return redirectRequest(`http://localhost:5437${pathname}${search}`);
  }

  if (pathname.startsWith("/api/data/")) {
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
        await denoKv.delete(["User", "Session", oldSessionId!, "Username"]);
      }

      await denoKv.set(
        ["User", "Session", sessionId!, "Username"],
        primaryEmail!.email,
      );

      await denoKv.set(
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
      const sessionId = await gitHubOAuth.getSessionId(req);

      if (sessionId === undefined) {
        return redirectRequest(`/signin?success_url=${pathname}`);
      } else {
        const currentUsername = await denoKv.get<string>([
          "User",
          "Session",
          sessionId,
          "Username",
        ]);

        if (currentUsername.value) {
          ctx.state.Username = currentUsername.value!;
        } else {
          throw new Error(`Invalid username`);
        }

        return ctx.next();
      }
    }
  }
}

export const handler = [loggedInCheck];
