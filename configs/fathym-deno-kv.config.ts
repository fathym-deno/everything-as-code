import { initializeDenoKv } from "../src/utils/deno-kv/initializeDenoKv.ts";

export const denoKv = await initializeDenoKv(
  Deno.env.get("FATHYM_DENO_KV_PATH") || undefined,
);

export const fathymDenoKv = Deno.env.get("FATHYM_DENO_KV_PATH") || undefined;
