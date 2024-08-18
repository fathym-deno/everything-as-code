import { assertEquals } from "../../../test.deps.ts";
import {
  EaCTracingModifierDetails,
  isEaCTracingModifierDetails,
} from "../../../../src/modules/applications/EaCTracingModifierDetails.ts";

Deno.test("EaCTraciingModifierDetails Tests", async (t) => {
  await t.step("Type Guard Check - True", () => {
    const details: EaCTracingModifierDetails = {
      Type: "Tracing",
      TraceRequest: true,
      TraceResponse: true,
    };

    assertEquals(isEaCTracingModifierDetails(details), true);
  });

  await t.step("Type Guard Check - False", async () => {
    const details = {
      Type: "SomethingElse",
    };

    assertEquals(isEaCTracingModifierDetails(details), false);
  });
});
