export { loadMetaUrl } from 'https://deno.land/x/fathym_common@v0.0.156/src/utils/library.helpers.ts';

export function loadRefArchMetaUrl(path: string): string {
    return loadMetaUrl(import.meta.resolve, path);
  }
  