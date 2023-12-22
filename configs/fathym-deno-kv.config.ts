import { initializeDenoKv } from "../src/utils/deno-kv/initializeDenoKv.ts";

export const fathymDenoKv = await initializeDenoKv(
  Deno.env.get("FATHYM_DENO_KV_PATH") || undefined,
);
