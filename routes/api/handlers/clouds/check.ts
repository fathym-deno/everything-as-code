// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerCloudCheckRequest, loadDeployment } from "./helpers.ts";
import { EaCHandlerCheckResponse } from "../../../../src/api/models/EaCHandlerCheckResponse.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { sleep } from "../../../../src/utils/sleep.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req: Request, _ctx: HandlerContext<any, EaCAPIUserState>) {
    // const username = ctx.state.Username;

    const checkRequest: EaCHandlerCloudCheckRequest = await req.json();

    try {
      const eac = checkRequest!.EaC as EverythingAsCodeClouds;

      const currentClouds = eac.Clouds || {};

      const cloud = currentClouds[checkRequest.CloudLookup] || {};

      const deployment = await loadDeployment(cloud, checkRequest.Name);

      const completeStati = ["Canceled", "Failed", "Succeeded"];

      const errorStati = ["Canceled", "Failed"];

      return respond({
        Complete: completeStati.some(
          (status) => status === deployment.properties?.provisioningState,
        ),
        HasError: errorStati.some(
          (status) => status === deployment.properties?.provisioningState,
        ),
        Messages: {
          [`Deployment: ${checkRequest.Name}`]: `Temp message`,
        },
      } as EaCHandlerCheckResponse);
    } catch (err) {
      return respond({
        Complete: true,
        HasError: true,
        Messages: {
          [`Deployment: ${checkRequest.Name}`]: JSON.stringify(err),
        },
      } as EaCHandlerCheckResponse);
    }
  },
};
