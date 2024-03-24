import { loadMetaUrl } from "../src.deps.ts";

export function loadEverythingAsCodeMetaUrl(path: string): string {
  return loadMetaUrl(import.meta.resolve, path);
}
