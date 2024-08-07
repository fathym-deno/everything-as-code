import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCDenoKVDistributedFileSystem = {
  DatabaseLookup: string;

  FileRoot: string;

  SegmentPath?: string;

  RootKey: Deno.KvKey;
} & EaCDistributedFileSystem<"DenoKV">;

export function isEaCDenoKVDistributedFileSystem(
  dfs: unknown,
): dfs is EaCDenoKVDistributedFileSystem {
  const x = dfs as EaCDenoKVDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("DenoKV", x) &&
    x.DatabaseLookup !== undefined &&
    typeof x.DatabaseLookup === "string" &&
    x.FileRoot !== undefined &&
    typeof x.FileRoot === "string" &&
    x.RootKey !== undefined &&
    Array.isArray(x.RootKey)
  );
}
