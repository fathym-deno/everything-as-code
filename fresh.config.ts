import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { iconSetPlugin } from "@fathym/atomic-icons";
import { curIconSetGenerateConfig } from "./configs/fathym-atomic-icons.config.ts";
import { msalPlugin } from "@fathym/msal";
import { msalPluginConfig } from "./configs/msal.config.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    await iconSetPlugin(curIconSetGenerateConfig),
    msalPlugin(msalPluginConfig),
  ],
  server: {
    port: 5437,
  },
});
