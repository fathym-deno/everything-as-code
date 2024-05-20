import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCStripeProcessor = {
  DatabaseLookup: string;

  LicenseLookup: string;
} & EaCProcessor<"Stripe">;

export function isEaCStripeProcessor(
  proc: unknown,
): proc is EaCStripeProcessor {
  const x = proc as EaCStripeProcessor;

  return (
    isEaCProcessor("Stripe", x) &&
    x.DatabaseLookup !== undefined &&
    typeof x.DatabaseLookup === "string" &&
    x.LicenseLookup !== undefined &&
    typeof x.LicenseLookup === "string"
  );
}
