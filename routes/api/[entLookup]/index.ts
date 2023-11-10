// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { EverythingAsCode } from "../../../src/eac/EverythingAsCode.ts";
import { enqueueAtomic } from "../../../src/utils/deno-kv/helpers.ts";
import { EaCDeleteRequest } from "../../../src/api/models/EaCDeleteRequest.ts";
import { EaCCommitRequest } from "../../../src/api/models/EaCCommitRequest.ts";
import { eacExists } from "../../../src/utils/eac/helpers.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";
import { EaCStatus } from "../../../src/api/models/EaCStatus.ts";
import { EaCCommitResponse } from "../../../src/api/models/EaCCommitResponse.ts";
import { EaCStatusProcessingTypes } from "../../../src/api/models/EaCStatusProcessingTypes.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get a user's EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const eac = await denoKv.get<EverythingAsCode>(["EaC", entLookup]);

    return respond(eac.value || {});
  },

  /**
   * Use this endpoint to commit update changes to an EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const username = ctx.state.Username;

    const eac = (await req.json()) as EverythingAsCode;

    const commitStatus: EaCStatus = {
      ID: crypto.randomUUID(),
      EnterpriseLookup: entLookup,
      Messages: { Queued: "Commiting existing EaC container" },
      Processing: EaCStatusProcessingTypes.QUEUED,
      StartTime: new Date(Date.now()),
      Username: username!,
    };

    const commitReq: EaCCommitRequest = {
      CommitID: commitStatus.ID,
      EaC: {
        ...(eac || {}),
        EnterpriseLookup: commitStatus.EnterpriseLookup,
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

    await enqueueAtomic(denoKv, commitReq, (op) => {
      return op
        .set(["EaC", "Status", "ID", commitStatus.ID], commitStatus)
        .set(
          ["EaC", "Status", "EaC", commitStatus.EnterpriseLookup],
          commitStatus,
        );
    });

    return respond({
      CommitID: commitStatus.ID,
      EnterpriseLookup: commitStatus.EnterpriseLookup,
      Message:
        `The enterprise '${commitReq.EaC.EnterpriseLookup}' commit has been queued.`,
    } as EaCCommitResponse);
  },

  /**
   * Use this endpoint to execute a set of delete operations or archive an entire EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async DELETE(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const username = ctx.state.Username!;

    const url = new URL(req.url);

    const commitStatus: EaCStatus = {
      ID: crypto.randomUUID(),
      EnterpriseLookup: entLookup!,
      Messages: { Queued: "Commiting existing EaC container" },
      Processing: EaCStatusProcessingTypes.QUEUED,
      StartTime: new Date(Date.now()),
      Username: username!,
    };

    const deleteReq: EaCDeleteRequest = {
      Archive: JSON.parse(
        url.searchParams.get("archive") || "false",
      ) as boolean,
      CommitID: commitStatus.ID,
      EnterpriseLookup: commitStatus.EnterpriseLookup,
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

    await enqueueAtomic(denoKv, deleteReq, (op) => {
      return op
        .set(["EaC", "Status", "ID", commitStatus.ID], commitStatus)
        .set(
          ["EaC", "Status", "EaC", commitStatus.EnterpriseLookup],
          commitStatus,
        );
    });

    return respond({
      CommitID: commitStatus.ID,
      EnterpriseLookup: commitStatus.EnterpriseLookup,
      Message: `The enterprise '${deleteReq.EnterpriseLookup}' ${
        deleteReq.Archive ? "archiving" : "delete operations"
      } have been queued.`,
    } as EaCCommitResponse);
  },
};
