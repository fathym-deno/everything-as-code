import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { redirectRequest } from "@fathym/common";
import { fathymDenoKv } from "../../configs/deno-kv.config.ts";
import { gitHubOAuth } from "../../src/services/github.ts";
import { EverythingAsCodeState } from "../../src/eac/EverythingAsCodeState.ts";
import { loadEaCSvc } from "../../configs/eac.ts";
import { UserGitHubConnection } from "../../src/github/UserGitHubConnection.ts";
import { cookieSession } from "$fresh/session";
import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";

async function loggedInCheck(req: Request, ctx: MiddlewareHandlerContext) {
  const url = new URL(req.url);

  const { pathname } = url;

  switch (pathname) {
    default: {
      const sessionId = await gitHubOAuth.getSessionId(req);

      if (sessionId === undefined) {
        return redirectRequest(`/signin?success_url=${pathname}`);
      } else {
        const currentUsername = await fathymDenoKv.get<string>([
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

async function currentEaC(
  req: Request,
  ctx: MiddlewareHandlerContext<EverythingAsCodeState>,
) {
  const currentEaC = await fathymDenoKv.get<string>([
    "User",
    ctx.state.Username!,
    "Current",
    "EaC",
  ]);

  let eac: EverythingAsCode | undefined = undefined;

  if (currentEaC.value) {
    const eacSvc = await loadEaCSvc(currentEaC.value, ctx.state.Username!);

    eac = await eacSvc.Get(currentEaC.value);
  }

  const state: EverythingAsCodeState = {
    ...ctx.state,
    EaC: eac,
  };

  ctx.state = state;

  return await ctx.next();
}

async function currentState(
  req: Request,
  ctx: MiddlewareHandlerContext<EverythingAsCodeState>,
) {
  const state: EverythingAsCodeState = {
    ...ctx.state,
  };

  if (ctx.state.EaC) {
    const clouds = Object.keys(ctx.state.EaC.Clouds || {});

    if (clouds.length > 0) {
      state.CloudLookup = clouds[0];

      const resGroups =
        ctx.state.EaC.Clouds![state.CloudLookup].ResourceGroups || {};

      const resGroupLookups = Object.keys(resGroups);

      if (resGroupLookups.length > 0) {
        state.ResourceGroupLookup = resGroupLookups[0];
      }
    }
  }

  const sessionId = await gitHubOAuth.getSessionId(req);

  const currentConn = await fathymDenoKv.get<UserGitHubConnection>([
    "User",
    "Session",
    sessionId!,
    "GitHub",
    "GitHubConnection",
  ]);

  if (currentConn.value!) {
    state.GitHub = {
      Username: currentConn.value.Username,
    };
  }

  ctx.state = state;

  return await ctx.next();
}

const session = cookieSession();

function userSession(
  req: Request,
  ctx: MiddlewareHandlerContext<EverythingAsCodeState>,
) {
  return session(req, ctx);
}

export const handler = [loggedInCheck, currentEaC, currentState, userSession];
