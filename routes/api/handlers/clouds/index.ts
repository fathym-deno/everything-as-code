// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import {
  beginEaCDeployments,
  buildCloudDeployments,
  finalizeCloudDetails,
} from "./helpers.ts";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EaCCloudAsCode } from "../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../src/api/models/EaCHandlerErrorResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx: HandlerContext<any, EaCAPIUserState>) {
    try {
      // const username = ctx.state.Username;

      const handlerRequest: EaCHandlerRequest = await req.json();

      const eac = handlerRequest.EaC as EverythingAsCodeClouds;

      const currentClouds = eac.Clouds || {};

      const cloudLookup = handlerRequest.Lookup;

      const current = currentClouds[cloudLookup] || {};

      const cloud = handlerRequest.Model as EaCCloudAsCode;

      await finalizeCloudDetails(cloud);

      const deployments = await buildCloudDeployments(
        eac,
        cloudLookup,
        cloud,
      );

      const checks: EaCHandlerCheckRequest[] = await beginEaCDeployments(
        current,
        deployments,
      );

      return respond({
        Checks: checks,
        Lookup: cloudLookup,
        Messages: {
          Message: `The cloud '${cloudLookup}' has been handled.`,
        },
        Model: cloud,
      } as EaCHandlerResponse);
    } catch (err) {
      console.error(err);

      return respond({
        HasError: true,
        Messages: {
          Error: JSON.stringify(err),
        },
      } as EaCHandlerErrorResponse);
    }
  },
};
