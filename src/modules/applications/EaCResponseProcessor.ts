import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCResponseProcessor = {
  Body: string;

  Headers?: Record<string, string>;

  Status: number;
} & EaCProcessor<"Response">;

export function isEaCResponseProcessor(
  proc: unknown,
): proc is EaCResponseProcessor {
  const x = proc as EaCResponseProcessor;

  return (
    isEaCProcessor("Response", x) &&
    x.Body !== undefined &&
    typeof x.Body === "string" &&
    x.Status !== undefined &&
    typeof x.Status === "number"
  );
}
