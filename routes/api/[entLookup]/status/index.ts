// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { Status } from "$std/http/http_status.ts";
import { EaCAPIState } from "../../../../src/api/EaCAPIState.ts";
import { EaCStatus } from "../../../../src/api/models/EaCStatus.ts";
import { denoKv } from "../../../../configs/deno-kv.config.ts";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to list a user's EaCs they have access to.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const statiResults = await denoKv.list<EaCStatus>({
      prefix: ["EaC", "Status", entLookup, "ID"],
    });

    const stati: EaCStatus[] = [];

    for await (const status of statiResults) {
      stati.push(status.value!);
    }

    return respond({
      Stati: stati,
    });
  },
};
