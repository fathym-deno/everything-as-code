import { Handlers } from "$fresh/server.ts";
import { gitHubOAuth } from "../../../../configs/oAuth.config.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    return await gitHubOAuth.signOut(req);
  },
};
