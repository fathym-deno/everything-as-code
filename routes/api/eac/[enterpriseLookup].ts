import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../../src/EverythingAsCode.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const enterpriseLookup = ctx.params.enterpriseLookup;

    const eac = await denoKv.get(["EaC", enterpriseLookup]);

    return respond(eac);
  },

  /**
   * Use this endpoint to update an EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async PUT(req, ctx) {
    const enterpriseLookup = ctx.params.enterpriseLookup;

    const eac = (await req.json()) as EverythingAsCode;

    if (!enterpriseLookup) {
      return respond({
        Message: "The enterprise lookup must be provided.",
      }, {
        status: Status.BadRequest,
      });
    }

    eac.EnterpriseLookup = enterpriseLookup;

    await denoKv.set(["EaC", eac.EnterpriseLookup], eac);

    return respond(eac);
  },

  /**
   * Use this endpoint to archive an EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async DELETE(req, ctx) {
    const enterpriseLookup = ctx.params.enterpriseLookup;

    if (!enterpriseLookup) {
      return respond({
        Message: "The enterprise lookup must be provided.",
      }, {
        status: Status.BadRequest,
      });
    }

    const eac = await denoKv.get(["EaC", enterpriseLookup]) as EverythingAsCode;

    eac.EnterpriseLookup = enterpriseLookup;

    await denoKv.set(["EaC", "Archive", eac.EnterpriseLookup], eac);

    await denoKv.delete(["EaC", eac.EnterpriseLookup]);

    return respond({
      Message: `The enterprise '${enterpriseLookup} has been archived.`,
    });
  },
};
