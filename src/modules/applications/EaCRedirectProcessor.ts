import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCRedirectProcessor = {
  Permanent: boolean;

  PreserveMethod: boolean;

  Redirect: string;
} & EaCProcessor<"Redirect">;

export function isEaCRedirectProcessor(
  proc: unknown,
): proc is EaCRedirectProcessor {
  const x = proc as EaCRedirectProcessor;

  return (
    isEaCProcessor("Redirect", x) &&
    x.Redirect !== undefined &&
    typeof x.Redirect === "string"
  );
}
