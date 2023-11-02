import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { Status } from "$std/http/http_status.ts";
import { jwtConfig } from "../../configs/jwt.config.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<Record<string, unknown>>,
) {
  const jwtToken = jwtConfig.LoadToken(req);

  const failureRespBody = { Message: "" };

  if (!jwtToken) {
    failureRespBody.Message =
      `A JWT token is required, provide it in the '${jwtConfig.Header}' header in the format '${jwtConfig.Schema} {token}'.`;
  }

  try {
    if (!(await jwtConfig.Verify(jwtToken!))) {
      failureRespBody.Message = "The provided token is invalid.";
    }
  } catch (err) {
    failureRespBody.Message = err.message;
  }

  if (failureRespBody.Message) {
    return respond(failureRespBody, {
      status: Status.Unauthorized,
    });
  }

  return ctx.next();
}
