import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCDFSProcessor = {
  DFS: EaCDistributedFileSystem;
} & EaCProcessor<"DFS">;

export function isEaCDFSProcessor(proc: unknown): proc is EaCDFSProcessor {
  const x = proc as EaCDFSProcessor;

  return isEaCProcessor("DFS", x) &&
    isEaCDistributedFileSystem(undefined, x.DFS);
}
