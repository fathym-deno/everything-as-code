import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EverythingAsCode } from "../../../src/EverythingAsCode.ts";
import { denoKv } from "../../../configs/deno-kv.config.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const body = "Hello World"; //JOKES[randomIndex];

    return new Response(body);
  },

  /**
   * Use this endpoint to create a new EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx) {
    const eac = (await req.json()) as EverythingAsCode;

    eac.EnterpriseLookup = crypto.randomUUID();

    await denoKv.set(["EaC", eac.EnterpriseLookup], eac);

    return respond(eac);
  },
};
