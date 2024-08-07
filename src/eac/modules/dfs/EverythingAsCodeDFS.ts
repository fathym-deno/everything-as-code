import { EaCMetadataBase } from "../../EaCMetadataBase.ts";
import { EaCDistributedFileSystem } from "./EaCDistributedFileSystem.ts";

export type EverythingAsCodeDFS = {
  DFS?: Record<string, EaCDistributedFileSystem | null>;
} & EaCMetadataBase;

export function isEverythingAsCodeDFS(
  eac: unknown,
): eac is EverythingAsCodeDFS {
  const sourcesEaC = eac as EverythingAsCodeDFS;

  return !!sourcesEaC;
}
