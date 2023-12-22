import { initializeDenoKv } from "../src/utils/deno-kv/initializeDenoKv.ts";

export const denoKv = await initializeDenoKv(
  Deno.env.get("DENO_KV_PATH") || undefined,
);
