// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerCloudCheckRequest, loadDeployment } from "./helpers.ts";
import { EaCHandlerCheckResponse } from "../../../../src/api/models/EaCHandlerCheckResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../src/api/models/EaCHandlerErrorResponse.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req: Request, _ctx: HandlerContext<any, EaCAPIUserState>) {
    try {
      // const username = ctx.state.Username;

      const checkRequest: EaCHandlerCloudCheckRequest = await req.json();

      const eac = checkRequest!.EaC as EverythingAsCodeClouds;

      const currentClouds = eac.Clouds || {};

      const cloudLookup = checkRequest!.Lookup;

      const cloud = currentClouds[checkRequest.CloudLookup] || {};

      const deployment = await loadDeployment(
        cloud,
        checkRequest.ResourceGroupLookup,
        checkRequest.Name,
      );

      return respond({
        Complete: false,
        HasError: false,
        Message: `Temp message`,
      } as EaCHandlerCheckResponse);
    } catch (err) {
      return respond({
        HasError: true,
        Message: JSON.stringify(err),
      } as EaCHandlerErrorResponse);
    }
  },
};
