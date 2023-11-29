import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createGitHubOAuthConfig, createHelpers } from "$fresh/oauth";
import { redirectRequest } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";

const { getSessionId } = createHelpers(
  createGitHubOAuthConfig({
    scope: ["user:email"],
  }),
);

async function loggedInCheck(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);

  const { pathname } = url;

  switch (pathname) {
    default: {
      const sessionId = await getSessionId(req);

      if (sessionId === undefined) {
        return redirectRequest(`/signin`);
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
