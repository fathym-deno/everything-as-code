// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { eacExists } from "../../../src/utils/eac/helpers.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";
import { EaCUserRecord } from "../../../src/api/EaCUserRecord.ts";
import { UserEaCRecord } from "../../../src/api/UserEaCRecord.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to invite a user to an EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const enterpriseLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const eacUser = (await req.json()) as EaCUserRecord;

    if (!enterpriseLookup) {
      return respond(
        {
          Message: "The enterprise lookup must be provided.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    if (!eacUser.Username) {
      return respond(
        {
          Message: "The username must be provided.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    if (!(await eacExists(denoKv, enterpriseLookup))) {
      return respond(
        {
          Message:
            "The enterprise must first be created before a user can be invited.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    await denoKv
      .atomic()
      .set(["User", eacUser.Username, "EaC", enterpriseLookup], {
        EnterpriseLookup: enterpriseLookup,
        Owner: true,
      } as UserEaCRecord)
      .set(["EaC", "Users", enterpriseLookup, eacUser.Username], {
        Username: eacUser.Username,
        Owner: true,
      } as EaCUserRecord)
      .commit();

    return respond({
      Message:
        `The user '${eacUser.Username}' has been invited to enterprise '${enterpriseLookup}'.`,
    });
  },
};
