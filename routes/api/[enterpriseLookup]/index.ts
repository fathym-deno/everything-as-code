// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../../src/EverythingAsCode.ts";
import { enqueueAtomic } from "../../../src/utils/deno-kv/helpers.ts";
import { EaCDeleteRequest } from "../../../src/api/models/EaCDeleteRequest.ts";
import { EaCCommitRequest } from "../../../src/api/models/EaCCommitRequest.ts";
import { eacExists } from "../../../src/utils/eac/helpers.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get a user's EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const enterpriseLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const eac = await denoKv.get(["EaC", enterpriseLookup]);

    return respond({
      EaC: eac,
    });
  },

  /**
   * Use this endpoint to commit update changes to an EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const enterpriseLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const eac = (await req.json()) as EverythingAsCode;

    const commitReq: EaCCommitRequest = {
      EaC: {
        ...(eac || {}),
        EnterpriseLookup: enterpriseLookup,
      },
      Username: "",
    };

    if (!commitReq.EaC.EnterpriseLookup) {
      return respond(
        {
          Message: "The enterprise lookup must be provided.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    if (!(await eacExists(denoKv, commitReq.EaC.EnterpriseLookup))) {
      return respond(
        {
          Message:
            "The enterprise must first be created before it can be updated.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    await enqueueAtomic(denoKv, commitReq);

    return respond({
      Message:
        `The enterprise '${commitReq.EaC.EnterpriseLookup}' commit has been queued.`,
    });
  },

  /**
   * Use this endpoint to execute a set of delete operations or archive an entire EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async DELETE(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const enterpriseLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const username = ctx.state.Username!;

    const url = new URL(req.url);

    const deleteReq: EaCDeleteRequest = {
      Archive: JSON.parse(
        url.searchParams.get("archive") || "false",
      ) as boolean,
      EnterpriseLookup: enterpriseLookup,
      Username: username,
    };

    if (!deleteReq.EnterpriseLookup) {
      return respond(
        {
          Message: "The enterprise lookup must be provided.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    if (!(await eacExists(denoKv, deleteReq.EnterpriseLookup))) {
      return respond(
        {
          Message: `The enterprise must first be created before it can ${
            deleteReq.Archive ? " be archived" : "execute delete operations"
          }.`,
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    await enqueueAtomic(denoKv, deleteReq);

    return respond({
      Message: `The enterprise '${deleteReq.EnterpriseLookup}' ${
        deleteReq.Archive ? "archiving" : "delete operations"
      } have been queued.`,
    });
  },
};
