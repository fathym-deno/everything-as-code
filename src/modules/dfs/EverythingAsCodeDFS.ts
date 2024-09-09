import { EaCMetadataBase } from "../../eac/EaCMetadataBase.ts";
import { EaCDistributedFileSystemAsCode } from "./EaCDistributedFileSystemAsCode.ts";

export type EverythingAsCodeDFS = {
  DFSs?: Record<string, EaCDistributedFileSystemAsCode>;
};

export function isEverythingAsCodeDFS(
  eac: unknown,
): eac is EverythingAsCodeDFS {
  const sourcesEaC = eac as EverythingAsCodeDFS;

  return !!sourcesEaC;
}
