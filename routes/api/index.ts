// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EverythingAsCode } from "../../src/EverythingAsCode.ts";
import { denoKv } from "../../configs/deno-kv.config.ts";
import { EaCAPIState } from "../../src/api/EaCAPIState.ts";
import { EaCCommitRequest } from "../../src/api/models/EaCCommitRequest.ts";
import { eacExists } from "../../src/utils/eac/helpers.ts";
import { Status } from "$std/http/http_status.ts";
import { enqueueAtomic } from "../../src/utils/deno-kv/helpers.ts";
import { UserEaCRecord } from "../../src/api/UserEaCRecord.ts";

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

    const userEaCs = await denoKv.getMany<EverythingAsCode[]>(
      userEaCRecords.map((userEaC) => ["EaC", userEaC.EnterpriseLookup]),
    );

    const eacs = userEaCs.map((eac) => eac.value!);

    return respond({
      EaCs: eacs,
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

    const commitReq: EaCCommitRequest = {
      EaC: {
        ...((await req.json()) || {}),
      },
      Username: username,
    };

    while (
      await eacExists(
        denoKv,
        commitReq.EaC.EnterpriseLookup || crypto.randomUUID(),
      )
    ) {
      commitReq.EaC.EnterpriseLookup = undefined;
    }

    if (!commitReq.EaC.EnterpriseLookup) {
      return respond(
        {
          Message: "There was an issue creating a new enterprise lookup.",
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
};
