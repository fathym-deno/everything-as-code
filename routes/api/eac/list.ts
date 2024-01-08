// deno-lint-ignore-file no-explicit-any
import { STATUS_CODE } from "$std/http/status.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIState } from "../../../src/api/EaCAPIState.ts";
import { denoKv } from "../../../configs/deno-kv.config.ts";
import { UserEaCRecord } from "../../../src/api/UserEaCRecord.ts";

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

    try {
      for await (const userEaCRecord of userEaCResults) {
        userEaCRecords.push(userEaCRecord.value);
      }
    } catch (err) {
      console.log(err);
    }

    // const userEaCs = await denoKv.getMany<EverythingAsCode[]>(
    //   userEaCRecords.map((userEaC) => ["EaC", userEaC.EnterpriseLookup]),
    // );

    // const eacs = userEaCs.map((eac) => eac.value!);

    return respond(userEaCRecords);
  },
};
