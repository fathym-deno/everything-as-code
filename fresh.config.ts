import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { iconSetPlugin } from "@fathym/atomic-icons";
import { curIconSetGenerateConfig } from "./configs/fathym-atomic-icons.config.ts";
import { msalPlugin } from "@fathym/msal";
import { msalPluginConfig } from "./configs/msal.config.ts";
import { gitHubOAuth } from "./configs/oAuth.config.ts";
import { gitHubAccessPlugin } from "./src/plugins/github/access/github-access.plugin.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    await iconSetPlugin(curIconSetGenerateConfig),
    msalPlugin(msalPluginConfig),
    gitHubAccessPlugin({
      Handlers: gitHubOAuth,
      RootPath: "/dashboard/github/access",
    }),
  ],
  server: {
    port: 5437,
  },
});
