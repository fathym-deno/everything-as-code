import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCOAuthProcessor = {
  ProviderLookup: string;
} & EaCProcessor<"OAuth">;

export function isEaCOAuthProcessor(proc: unknown): proc is EaCOAuthProcessor {
  const x = proc as EaCOAuthProcessor;

  return (
    isEaCProcessor("OAuth", x) &&
    x.ProviderLookup !== undefined &&
    typeof x.ProviderLookup === "string"
  );
}
