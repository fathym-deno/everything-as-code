import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { JWTConfig } from "./JWTConfig.ts";
import { Status } from "$std/http/http_status.ts";

export function buildJwtValidationHandler<TPayload>(jwtConfig: JWTConfig) {
  return async function jwtValidateHandler(
    req: Request,
    ctx: MiddlewareHandlerContext,
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
      console.error(err);

      failureRespBody.Message = err.message;

      failureRespBody.HasError = true;
    }

    if (failureRespBody.HasError) {
      return respond(failureRespBody, {
        status: Status.Unauthorized,
      });
    }

    const [_header, payload] = await jwtConfig.Decode<TPayload>(jwtToken!);

    ctx.state = {
      ...(ctx.state || {}),
      ...(payload || {}),
      JWT: jwtToken,
    };

    return ctx.next();
  };
}
