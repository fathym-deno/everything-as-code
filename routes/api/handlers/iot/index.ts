// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCIoTAsCode } from "../../../../src/eac/modules/iot/EaCIoTAsCode.ts";
import { EverythingAsCodeIoT } from "../../../../src/eac/modules/iot/EverythingAsCodeIoT.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../src/api/models/EaCHandlerErrorResponse.ts";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { ensureIoTDevices } from "./helpers.ts";

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

      const eac: EverythingAsCodeIoT & EverythingAsCodeClouds =
        handlerRequest.EaC;

      const currentIoT = eac.IoT || {};

      const iotLookup = handlerRequest.Lookup;

      const current = currentIoT[iotLookup] || {};

      const iot = handlerRequest.Model as EaCIoTAsCode;

      const iotCloud = eac.Clouds![current.CloudLookup!];

      const devicesResp = await ensureIoTDevices(iotCloud, current, iot);

      if (Object.keys(devicesResp || {}).length === 0) {
        return respond({
          Checks: [],
          Lookup: iotLookup,
          Messages: {
            Message: `The iot '${iotLookup}' has been handled.`,
          },
          Model: current,
        } as EaCHandlerResponse);
      } else {
        return respond({
          HasError: true,
          Messages: {
            Errors: devicesResp,
          },
        } as EaCHandlerErrorResponse);
      }
    } catch (err) {
      return respond({
        HasError: true,
        Messages: {
          Error: JSON.stringify(err),
        },
      } as EaCHandlerErrorResponse);
    }
  },
};
