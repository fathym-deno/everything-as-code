// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { eacExists } from "../../../src/utils/eac/helpers.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";
import { UserEaCRecord } from "../../../src/api/UserEaCRecord.ts";
import { EaCStatus } from "../../../src/api/models/EaCStatus.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get the current status of an EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const enterpriseLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const status = await denoKv.get<EaCStatus>([
      "EaC",
      "Status",
      enterpriseLookup,
    ]);

    const idleStatus: EaCStatus = {
      Messages: {},
      EnterpriseLookup: enterpriseLookup,
      Processing: false,
      Username: "system",
    };

    return respond(
      status?.value! || idleStatus,
    );
  },
};
