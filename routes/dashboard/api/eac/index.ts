// deno-lint-ignore-file no-explicit-any
import { Status } from "$std/http/http_status.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EverythingAsCodeState } from "../../../../src/eac/EverythingAsCodeState.ts";
import { fathymDenoKv } from "../../../../configs/deno-kv.config.ts";

export const handler: Handlers<any, EverythingAsCodeState> = {
  /**
   * Use this endpoint to get a user's current EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  GET(_req, ctx) {
    return respond(ctx.state.EaC || {});
  },
};
