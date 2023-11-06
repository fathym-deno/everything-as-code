import { Handlers, PageProps } from "$fresh/server.ts";
import { jwtConfig } from "../../configs/jwt.config.ts";

interface JWTPageData {
  jwt?: string;
}

export const handler: Handlers<JWTPageData | null, Record<string, unknown>> = {
  async GET(_, ctx) {
    //  TODO: Get username from oauth provider
    const jwt = await jwtConfig.Create({
      Username: "michael.gearhardt@fathym.com",
    });

    const data: JWTPageData = { jwt };

    return ctx.render(data);
  },
};

export default function JWT({
  data,
}: PageProps<JWTPageData | null, Record<string, unknown>>) {
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
