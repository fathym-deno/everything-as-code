import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCDenoKVDistributedFileSystem = {
  DatabaseLookup: string;
} & EaCDistributedFileSystem<"DenoKV">;

export function isEaCNPMDistributedFileSystem(
  dfs: unknown,
): dfs is EaCDenoKVDistributedFileSystem {
  const x = dfs as EaCDenoKVDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("DenoKV", x) &&
    x.DatabaseLookup !== undefined &&
    typeof x.DatabaseLookup === "string"
  );
}
