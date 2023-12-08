// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { merge, respond } from "@fathym/common";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { EaCAPIState } from "../../src/api/EaCAPIState.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import { eacExists } from "../../src/utils/eac/helpers.ts";
import { Status } from "$std/http/http_status.ts";
import { enqueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";
import { EaCStatus } from "../../src/api/models/EaCStatus.ts";
import { EaCCommitResponse } from "../../src/api/models/EaCCommitResponse.ts";
import { EaCStatusProcessingTypes } from "../../src/api/models/EaCStatusProcessingTypes.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to list a user's EaCs they have access to.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req: Request, ctx: HandlerContext<any, EaCAPIState>) {
    const username = ctx.state.Username!;

    const userEaCResults = await denoKv.list<UserEaCRecord>({
      prefix: ["User", username, "EaC"],
    });

    const userEaCRecords: UserEaCRecord[] = [];

    for await (const userEaCRecord of userEaCResults) {
      userEaCRecords.push(userEaCRecord.value);
    }

    // const userEaCs = await denoKv.getMany<EverythingAsCode[]>(
    //   userEaCRecords.map((userEaC) => ["EaC", userEaC.EnterpriseLookup]),
    // );

    // const eacs = userEaCs.map((eac) => eac.value!);

    return respond({
      UserEaCs: userEaCRecords,
    });
  },

  /**
   * Use this endpoint to commit a new EaC container.
   * @param _req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: HandlerContext<any, EaCAPIState>) {
    const username = ctx.state.Username!;

    const url = new URL(req.url);

    const processingSeconds = Number.parseInt(
      url.searchParams.get("processingSeconds")!,
    );

    const createStatus: EaCStatus = {
      ID: crypto.randomUUID(),
      EnterpriseLookup: crypto.randomUUID(),
      Messages: { Queued: "Creating new EaC container" },
      Processing: EaCStatusProcessingTypes.QUEUED,
      StartTime: new Date(Date.now()),
      Username: username,
    };

    while (await eacExists(denoKv, createStatus.EnterpriseLookup)) {
      createStatus.EnterpriseLookup = crypto.randomUUID();
    }

    const commitReq: EaCCommitRequest = {
      CommitID: createStatus.ID,
      EaC: {
        ...((await req.json()) || {}),
        EnterpriseLookup: createStatus.EnterpriseLookup,
      },
      JWT: ctx.state.JWT!,
      ProcessingSeconds: processingSeconds,
      Username: username,
    };

    if (!commitReq.EaC.EnterpriseLookup) {
      return respond(
        {
          Message: "There was an issue creating a new EaC container.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    if (!commitReq.EaC.Details?.Name) {
      return respond(
        {
          Message:
            "The name must be provided when creating a new EaC container.",
        },
        {
          status: Status.BadRequest,
        },
      );
    }

    await enqueueAtomic(denoKv, commitReq, (op) => {
      return op
        .set(
          [
            "EaC",
            "Status",
            createStatus.EnterpriseLookup,
            "ID",
            createStatus.ID,
          ],
          createStatus,
        )
        .set(
          ["EaC", "Status", createStatus.EnterpriseLookup, "EaC"],
          createStatus,
        );
    });

    return respond({
      CommitID: createStatus.ID,
      EnterpriseLookup: createStatus.EnterpriseLookup,
      Message:
        `The enterprise '${createStatus.EnterpriseLookup}' commit has been queued.`,
    } as EaCCommitResponse);
  },
};
