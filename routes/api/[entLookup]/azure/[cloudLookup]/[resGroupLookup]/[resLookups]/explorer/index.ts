// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { ResourceManagementClient } from "npm:@azure/arm-resources";
import { Location, SubscriptionClient } from "npm:@azure/arm-subscriptions";
import { EaCAPIUserState } from "../../../../../../../../src/api/EaCAPIUserState.ts";
import { denoKv } from "../../../../../../../../configs/deno-kv.config.ts";
import { loadAzureCloudCredentials } from "../../../../../../../../src/utils/eac/loadAzureCloudCredentials.ts";
import { EaCServiceDefinitions } from "../../../../../../../../src/api/models/EaCServiceDefinitions.ts";
import { EverythingAsCodeClouds } from "../../../../../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EaCCloudAzureDetails } from "../../../../../../../../src/eac/modules/clouds/EaCCloudAzureDetails.ts";
import { loadKustoClient } from "../../../../../../../../src/services/azure/kusto.ts";

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

    const url = new URL(req.url);

    const svcSuffix = url.searchParams.get("svcSuffix") as string | undefined;

    const kustoClient = await loadKustoClient(
      entLookup,
      cloudLookup,
      resGroupLookup,
      resLookups,
      svcSuffix,
    );

    return respond({
      Locations: locations,
    });
  },
};
