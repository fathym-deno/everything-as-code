import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCPreactAppProcessor = {
  AppRoot: string;
} & EaCProcessor<"PreactApp">;

export function isEaCPreactAppProcessor(
  proc: unknown,
): proc is EaCPreactAppProcessor {
  const x = proc as EaCPreactAppProcessor;

  return (
    isEaCProcessor("PreactApp", x) &&
    x.AppRoot !== undefined &&
    typeof x.AppRoot === "string"
  );
}
