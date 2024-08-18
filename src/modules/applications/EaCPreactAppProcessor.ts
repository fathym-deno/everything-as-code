import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCPreactAppProcessor = {
  AppDFSLookup: string;

  // BundleDFSLookup?: string;

  ComponentDFSLookups?: [string, string[]][];
} & EaCProcessor<"PreactApp">;

export function isEaCPreactAppProcessor(
  proc: unknown,
): proc is EaCPreactAppProcessor {
  const x = proc as EaCPreactAppProcessor;

  return (
    isEaCProcessor("PreactApp", x) &&
    x.AppDFSLookup !== undefined &&
    typeof x.AppDFSLookup === "string"
  );
}
