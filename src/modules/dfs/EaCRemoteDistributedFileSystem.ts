import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCRemoteDistributedFileSystem = {
  RemoteRoot: string;
} & EaCDistributedFileSystem<"Remote">;

export function isEaCRemoteDistributedFileSystem(
  dfs: unknown,
): dfs is EaCRemoteDistributedFileSystem {
  const x = dfs as EaCRemoteDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("Remote", x) &&
    x.RemoteRoot !== undefined &&
    typeof x.RemoteRoot === "string"
  );
}
