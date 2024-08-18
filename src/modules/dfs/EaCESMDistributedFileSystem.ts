import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCESMDistributedFileSystem = {
  EntryPoints: string[];

  IncludeDependencies?: boolean;

  Root: string;
} & EaCDistributedFileSystem<"ESM">;

export function isEaCESMDistributedFileSystem(
  dfs: unknown,
): dfs is EaCESMDistributedFileSystem {
  const x = dfs as EaCESMDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("ESM", x) &&
    Array.isArray(x.EntryPoints) &&
    x.Root !== undefined &&
    typeof x.Root === "string"
  );
}
