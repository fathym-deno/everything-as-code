// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../../../../../../../src/api/EaCAPIUserState.ts";
import { ExplorerRequest } from "../../../../../../../../../../src/api/models/ExplorerRequest.ts";
import { loadKustoClient } from "../../../../../../../../../../src/services/azure/kusto.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async POST(req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const cloudLookup: string = ctx.params.cloudLookup;

    const resGroupLookup: string = ctx.params.resGroupLookup;

    const resLookups: string[] = ctx.params.resLookups.split("|");

    const db: string = ctx.params.db;

    const url = new URL(req.url);

    const svcSuffix = url.searchParams.get("svcSuffix") as string | undefined;

    const explorerReq: ExplorerRequest = await req.json();

    const kustoClient = await loadKustoClient(
      entLookup,
      cloudLookup,
      resGroupLookup,
      resLookups,
      svcSuffix,
    );

    kustoClient.ensureOpen();

    const dataSetResp = await kustoClient.execute(db, explorerReq.Query);

    return respond(JSON.stringify(dataSetResp));
  },
};
