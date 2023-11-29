import { getCookies, setCookie } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";
import { denoKv } from "../configs/deno-kv.config.ts";
import { redirectRequest } from "@fathym/common";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig({
    scope: ["user:email"],
  }),
);

async function loggedInCheck(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);

  const { pathname } = url;

  switch (pathname) {
    case "/signin": {
      return await signIn(req);
    }

    case "/signin/callback": {
      const { response, tokens, sessionId } = await handleCallback(req);

      const { accessToken } = tokens;

      const resp = await fetch(`https://api.github.com/user/emails`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const emails: { primary: boolean; email: string }[] = await resp.json();

      const primaryEmail = emails.find((e) => e.primary);

      const oldSessionId = await getSessionId(req);

      if (oldSessionId) {
        await denoKv.delete(["User", "Session", oldSessionId!, "Username"]);
      }

      await denoKv.set(
        ["User", "Session", sessionId!, "Username"],
        primaryEmail!.email,
      );

      return response;
    }

    case "/signout": {
      return await signOut(req);
    }

    default: {
      return ctx.next();
    }
  }
}

export const handler = [loggedInCheck];
