import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { Status } from "$std/http/http_status.ts";
import { jwtConfig } from "../../configs/jwt.config.ts";
import { EaCAPIState } from "../../src/api/EaCAPIState.ts";
import { EaCAPIJWTPayload } from "../../src/api/EaCAPIJWTPayload.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<EaCAPIState>,
) {
  const jwtToken = jwtConfig.LoadToken(req);

  const failureRespBody = { HasError: false, Message: "" };

  if (!jwtToken) {
    failureRespBody.Message =
      `A JWT token is required, provide it in the '${jwtConfig.Header}' header in the format '${jwtConfig.Schema} {token}'.`;
  }

  try {
    if (!(await jwtConfig.Verify(jwtToken!))) {
      failureRespBody.Message = "The provided token is invalid.";

      failureRespBody.HasError = true;
    }
  } catch (err) {
    failureRespBody.Message = err.message;

    failureRespBody.HasError = true;
  }

  if (failureRespBody.HasError) {
    return respond(failureRespBody, {
      status: Status.Unauthorized,
    });
  }

  const [_header, payload] = await jwtConfig.Decode<EaCAPIJWTPayload>(
    jwtToken!,
  );

  ctx.state = {
    ...(ctx.state || {}),
    ...(payload || {}),
  };

  return ctx.next();
}
