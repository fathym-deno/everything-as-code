import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { Status } from "$std/http/http_status.ts";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { UserEaCRecord } from "../../../../src/api/UserEaCRecord.ts";
import { denoKv } from "../../../../configs/deno-kv.config.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<EaCAPIUserState>,
) {
  const username = ctx.state.Username!;

  const entLookup = ctx.params.entLookup;

  if (entLookup !== ctx.state.EnterpriseLookup) {
    return respond(
      {
        Message:
          `The current JWT does not have access to the enterprise '${entLookup}'.`,
      },
      {
        status: Status.Unauthorized,
      },
    );
  }

  let userEaC = await denoKv.get<UserEaCRecord>([
    "User",
    username,
    "EaC",
    entLookup,
  ]);

  if (!userEaC.value) {
    userEaC = await denoKv.get<UserEaCRecord>([
      "User",
      username,
      "Archive",
      "EaC",
      entLookup,
    ]);
  }

  if (!userEaC?.value) {
    return respond(
      {
        Message: `You do not have access to the enterprise '${entLookup}'.`,
      },
      {
        status: Status.Unauthorized,
      },
    );
  }

  ctx.state.UserEaC = userEaC.value;

  return ctx.next();
}
