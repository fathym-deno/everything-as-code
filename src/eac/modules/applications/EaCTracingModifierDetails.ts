import { XML_ATTRKEY } from "../../../../../../../../AppData/Local/deno/npm/registry.npmjs.org/@azure/core-client/1.8.0/types/latest/core-client.d.ts";
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
