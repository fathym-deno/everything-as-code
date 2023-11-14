// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { merge, respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EaCCloudAsCode } from "../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../src/api/models/EaCHandlerErrorResponse.ts";
import {
  beginEaCDeployments,
  buildCloudDeployments,
  loadDeployment,
} from "./helpers.ts";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";

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

      const deployments = await buildCloudDeployments(
        cloudLookup,
        cloud,
      );

      const checks: EaCHandlerCheckRequest[] = await beginEaCDeployments(
        cloud?.Details ? cloud : current,
        deployments,
      );

      const merged = merge(current, cloud);

      return respond({
        Checks: checks,
        Lookup: cloudLookup,
        Message: `The cloud '${cloudLookup}' has been handled.`,
        Model: merged,
      } as EaCHandlerResponse);
    } catch (err) {
      return respond({
        HasError: true,
        Message: JSON.stringify(err),
      } as EaCHandlerErrorResponse);
    }
  },
};
