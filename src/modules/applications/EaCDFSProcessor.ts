import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "../dfs/EaCDistributedFileSystem.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCDFSProcessor = {
  DFSLookup: string;
} & EaCProcessor<"DFS">;

export function isEaCDFSProcessor(proc: unknown): proc is EaCDFSProcessor {
  const x = proc as EaCDFSProcessor;

  return (
    isEaCProcessor("DFS", x) &&
    x.DFSLookup !== undefined &&
    typeof x.DFSLookup === "string"
  );
}
