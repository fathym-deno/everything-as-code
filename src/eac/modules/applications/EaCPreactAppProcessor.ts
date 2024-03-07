import {
  EaCDistributedFileSystem,
  isEaCDistributedFileSystem,
} from "./EaCDistributedFileSystem.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCPreactAppProcessor = {
  App: EaCDistributedFileSystem;

  Bundle: EaCDistributedFileSystem;

  Components?: EaCDistributedFileSystem[];
} & EaCProcessor<"PreactApp">;

export function isEaCPreactAppProcessor(
  proc: unknown,
): proc is EaCPreactAppProcessor {
  const x = proc as EaCPreactAppProcessor;

  return (
    isEaCProcessor("PreactApp", x) &&
    isEaCDistributedFileSystem(undefined, x.App) &&
    isEaCDistributedFileSystem(undefined, x.Bundle)
  );
}
