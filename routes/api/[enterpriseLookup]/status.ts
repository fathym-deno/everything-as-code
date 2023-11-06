// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { eacExists } from "../../../src/utils/eac/helpers.ts";
import { EaCAPIUserState } from "../../../src/api/EaCAPIUserState.ts";
import { UserEaCRecord } from "../../../src/api/UserEaCRecord.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to get the current status of an EaC.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(_req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    // TODO: Track status of EaC

    return respond({
      StatusMessage: "Hello World",
    });
  },
};
