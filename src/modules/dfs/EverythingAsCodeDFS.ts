import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EaCDistributedFileSystem } from "./EaCDistributedFileSystem.ts";

export type EverythingAsCodeDFS = {
  DFS?: Record<string, EaCDistributedFileSystem>;
} & EaCMetadataBase;

export function isEverythingAsCodeDFS(
  eac: unknown,
): eac is EverythingAsCodeDFS {
  const sourcesEaC = eac as EverythingAsCodeDFS;

  return !!sourcesEaC;
}
