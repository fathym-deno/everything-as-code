import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const enterpriseLookup = ctx.params.enterpriseLookup;

    const eac = await denoKv.get(["EaC", enterpriseLookup]);

    return respond(eac);
  },
};
