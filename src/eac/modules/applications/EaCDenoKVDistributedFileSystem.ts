import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCDenoKVDistributedFileSystem = {
  DatabaseLookup: string;

  FileRoot: string;
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
    typeof x.FileRoot === "string"
  );
}
