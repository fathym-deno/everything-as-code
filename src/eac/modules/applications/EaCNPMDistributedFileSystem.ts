import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCNPMDistributedFileSystem = {
  Package: string;

  Version: string;
} & EaCDistributedFileSystem<"NPM">;

export function isEaCNPMDistributedFileSystem(
  dfs: unknown,
): dfs is EaCNPMDistributedFileSystem {
  const x = dfs as EaCNPMDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("NPM", x) &&
    x.Package !== undefined &&
    typeof x.Package === "string" &&
    x.Version !== undefined &&
    typeof x.Version === "string"
  );
}
