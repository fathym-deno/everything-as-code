import { Plugin } from "$fresh/server.ts";
import { OAuthHelpers } from "../../../services/oAuth.ts";
import { establishSigninCallbackRoute } from "./routes/signin/callback.ts";
import { establishSigninRoute } from "./routes/signin/index.ts";
import { establishSignoutRoute } from "./routes/signout.ts";

export type GitHubAccessPluginConfig = {
  Handlers: OAuthHelpers;

  RootPath?: string;
};

export function gitHubAccessPlugin(config: GitHubAccessPluginConfig): Plugin {
  const rootPath = config.RootPath || "/github/access";

  const signinRoute = establishSigninRoute(config.Handlers);

  const signinCallbackRoute = establishSigninCallbackRoute(config.Handlers);

  const signoutRoute = establishSignoutRoute(config.Handlers);

  return {
    name: "fathym_github_access",
    routes: [
      {
        path: `${rootPath}/signin`,
        ...signinRoute,
      },
      {
        path: `${rootPath}/signin/callback`,
        ...signinCallbackRoute,
      },
      {
        path: `${rootPath}/signout`,
        ...signoutRoute,
      },
    ],
  };
}
