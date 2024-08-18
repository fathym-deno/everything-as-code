import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCTailwindProcessor = {
  AutoprefixerOptionsPath?: string;

  ConfigPath?: string;

  DFSLookups: string[];

  StylesTemplatePath?: string;
} & EaCProcessor<"Tailwind">;

export function isEaCTailwindProcessor(
  proc: unknown,
): proc is EaCTailwindProcessor {
  const x = proc as EaCTailwindProcessor;

  return isEaCProcessor("Tailwind", x) && Array.isArray(x.DFSLookups);
}
