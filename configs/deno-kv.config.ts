import { existsSync } from "@fathym/common";
import { dirname } from "$std/path/mod.ts";

const denoKvPath = Deno.env.get("DENO_KV_PATH") || undefined;

if (denoKvPath && !existsSync(denoKvPath)) {
  const path = dirname(denoKvPath);

  Deno.mkdirSync(path);
}

export const denoKv = await Deno.openKv(denoKvPath);
