import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import { msalPlugin } from "@fathym/msal";
import twindConfig from "./twind.config.ts";
import { msalPluginConfig } from "./configs/msal.config.ts";

export default defineConfig({
  plugins: [twindPlugin(twindConfig), msalPlugin(msalPluginConfig)],
  server: {
    port: 5437,
  },
});
