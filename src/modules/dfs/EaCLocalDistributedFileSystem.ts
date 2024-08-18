import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCLocalDistributedFileSystem = {
  FileRoot: string;
} & EaCDistributedFileSystem<"Local">;

export function isEaCLocalDistributedFileSystem(
  dfs: unknown,
): dfs is EaCLocalDistributedFileSystem {
  const x = dfs as EaCLocalDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("Local", x) &&
    x.FileRoot !== undefined &&
    typeof x.FileRoot === "string"
  );
}
