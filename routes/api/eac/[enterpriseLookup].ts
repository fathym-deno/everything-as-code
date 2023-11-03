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

    const existingEaC = await denoKv.get([
      "EaC",
      enterpriseLookup,
    ]) as EverythingAsCode;

    //  TODO: Differential update

    await denoKv.set(["EaC", eac.EnterpriseLookup], eac);

    return respond(eac);
  },

  /**
   * Use this endpoint to execute a set of delete operations or archive an entire EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async DELETE(req, ctx) {
    const enterpriseLookup = ctx.params.enterpriseLookup;

    const url = new URL(req.url);

    const archive = JSON.parse(
      url.searchParams.get("archive") || "false",
    ) as boolean;

    if (!enterpriseLookup) {
      return respond({
        Message: "The enterprise lookup must be provided.",
      }, {
        status: Status.BadRequest,
      });
    }

    const eac = await denoKv.get(["EaC", enterpriseLookup]) as EverythingAsCode;

    eac.EnterpriseLookup = enterpriseLookup;

    if (archive) {
      await denoKv.set(["EaC", "Archive", eac.EnterpriseLookup], eac);

      await denoKv.delete(["EaC", eac.EnterpriseLookup]);
    } else {
      //  TODO: Execute delete operations
    }

    return respond({
      Message: `The enterprise '${enterpriseLookup} has been archived.`,
    });
  },
};
