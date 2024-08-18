import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";

export type EaCJSRDistributedFileSystem = {
  Package: string;

  Version?: string;
} & EaCDistributedFileSystem<"JSR">;

export function isEaCJSRDistributedFileSystem(
  dfs: unknown,
): dfs is EaCJSRDistributedFileSystem {
  const x = dfs as EaCJSRDistributedFileSystem;

  return (
    isEaCDistributedFileSystem("JSR", x) &&
    x.Package !== undefined &&
    typeof x.Package === "string"
  );
}
