import { Handlers } from "../../../../src.deps.ts";
import { OAuthHelpers } from "../../../../services/oAuth.ts";

export function establishSignoutRoute(oAuthHandlers: OAuthHelpers) {
  const handler: Handlers = {
    async GET(req, _ctx) {
      return await oAuthHandlers.signOut(req);
    },
  };

  return { handler, component: undefined };
}
