import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCAPIProcessor = {
  DefaultContentType?: string;

  DFSLookup: string;
} & EaCProcessor<"API">;

export function isEaCAPIProcessor(proc: unknown): proc is EaCAPIProcessor {
  const x = proc as EaCAPIProcessor;

  return (
    isEaCProcessor("API", x) &&
    x.DFSLookup !== undefined &&
    typeof x.DFSLookup === "string"
  );
}
