// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { ResourceManagementClient } from "npm:@azure/arm-resources";
import { Location, SubscriptionClient } from "npm:@azure/arm-subscriptions";
import { EaCAPIUserState } from "../../../../../../src/api/EaCAPIUserState.ts";
import { denoKv } from "../../../../../../configs/deno-kv.config.ts";
import { loadAzureCloudCredentials } from "../../../../../../src/utils/eac/loadAzureCloudCredentials.ts";
import { EaCServiceDefinitions } from "../../../../../../src/api/models/EaCServiceDefinitions.ts";
import { EverythingAsCodeClouds } from "../../../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EaCCloudAzureDetails } from "../../../../../../src/eac/modules/clouds/EaCCloudAzureDetails.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async GET(req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const entLookup = ctx.state.UserEaC!.EnterpriseLookup;

    const cloudLookup: string = ctx.params.cloudLookup;

    const url = new URL(req.url);

    const scopes: string[] = (url.searchParams.get("scope") as string).split(
      ",",
    );

    const eacResult = await denoKv.get<EverythingAsCodeClouds>([
      "EaC",
      entLookup,
    ]);

    const eac = eacResult.value!;

    const creds = loadAzureCloudCredentials(eac, cloudLookup);

    const authToken = await creds.getToken(scopes);

    return respond({
      Token: authToken.token,
    });
  },
};
