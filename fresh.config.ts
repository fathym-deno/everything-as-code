import { defineConfig } from "$fresh/server.ts";
import { iconSetPlugin } from "@fathym/atomic-icons";
import { curIconSetGenerateConfig } from "./configs/fathym-atomic-icons.config.ts";
import { msalPlugin } from "@fathym/msal";
import { msalPluginConfig } from "./configs/msal.config.ts";
import twindConfig from "./twind.config.ts";
import twindPlugin from "$fresh/plugins/twind.ts";

export default defineConfig({
  plugins: [
    twindPlugin(twindConfig),
    await iconSetPlugin(curIconSetGenerateConfig),
    msalPlugin(msalPluginConfig),
  ],
  server: {
    port: 5437,
  },
});
