import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCAPIProcessor = {
  DefaultContentType?: string;

  DFS: EaCDistributedFileSystem;
} & EaCProcessor<"API">;

export function isEaCAPIProcessor(proc: unknown): proc is EaCAPIProcessor {
  const x = proc as EaCAPIProcessor;

  return isEaCProcessor("API", x) &&
    isEaCDistributedFileSystem(undefined, x.DFS);
}
