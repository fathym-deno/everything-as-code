import {
  EaCModifierDetails,
  isEaCModifierDetails,
} from "./EaCModifierDetails.ts";

export type EaCTracingModifierDetails = {
  TraceRequest: boolean;

  TraceResponse: boolean;
} & EaCModifierDetails<"Tracing">;

export function isEaCTracingModifierDetails(
  details: unknown,
): details is EaCTracingModifierDetails {
  const x = details as EaCTracingModifierDetails;

  return (
    isEaCModifierDetails("Tracing", x) &&
    x.TraceRequest !== undefined &&
    typeof x.TraceRequest === "boolean" &&
    x.TraceResponse !== undefined &&
    typeof x.TraceResponse === "boolean"
  );
}
