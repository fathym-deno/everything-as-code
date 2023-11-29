import { Handlers, PageProps } from "$fresh/server.ts";
import { jwtConfig } from "../../configs/jwt.config.ts";
import { EverythingAsCodeState } from "../../src/eac/EverythingAsCodeState.ts";

interface JWTPageData {
  jwt?: string;
}

export const handler: Handlers<JWTPageData | null, EverythingAsCodeState> = {
  async GET(_req, ctx) {
    //  TODO: Get username from oauth provider
    const jwt = await jwtConfig.Create({
      Username: ctx.state.Username,
    });

    const data: JWTPageData = { jwt };

    return ctx.render(data);
  },
};

export default function JWT({
  data,
}: PageProps<JWTPageData | null, EverythingAsCodeState>) {
  return (
    <div>
      <form>
        <button type="submit">Create New JWT</button>
      </form>

      <div>{data!.jwt}</div>

      <p>The token is good for 1 year.</p>
    </div>
  );
}
