import { existsSync } from "@fathym/common";
import { dirname } from "$std/path/mod.ts";

export async function initializeDenoKv(denoKvPath?: string) {
  console.log(`Initializing DenoKV at ${denoKvPath}`);

  if (
    denoKvPath && !denoKvPath.startsWith("https") && !existsSync(denoKvPath)
  ) {
    const denoKvDir = dirname(denoKvPath);

    if (denoKvDir && !existsSync(denoKvDir)) {
      console.log(`Ensuring DenoKV directory ${denoKvDir}`);

      Deno.mkdirSync(denoKvDir);
    }
  }

  console.log(`Loading DenoKV instance for ${denoKvPath}`);

  return await Deno.openKv(denoKvPath);
}
