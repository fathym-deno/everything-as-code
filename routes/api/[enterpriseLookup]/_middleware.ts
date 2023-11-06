import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { Status } from "$std/http/http_status.ts";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { UserEaCRecord } from "../../../src/api/UserEaCRecord.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<EaCAPIUserState>,
) {
  const username = ctx.state.Username!;

  const enterpriseLookup = ctx.params.enterpriseLookup;

  const userEaC = await denoKv.get<UserEaCRecord>([
    "User",
    username,
    "EaC",
    enterpriseLookup,
  ]);

  if (!userEaC?.value) {
    return respond(
      {
        Message:
          `You do not have access to the enterprise '${enterpriseLookup}'.`,
      },
      {
        status: Status.Unauthorized,
      },
    );
  }

  ctx.state.UserEaC = userEaC.value;

  return ctx.next();
}
