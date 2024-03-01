import { assertEquals } from "../../../test.deps.ts";
import {
  EaCDFSProcessor,
  isEaCDFSProcessor,
} from "../../../../src/eac/modules/applications/EaCDFSProcessor.ts";
import { EaCRemoteDistributedFileSystem } from "../../../../src/eac/modules/applications/EaCRemoteDistributedFileSystem.ts";

Deno.test("EaCDFSProcessor Tests", async (t) => {
  await t.step("Type Guard Check - True", () => {
    const details: EaCDFSProcessor = {
      Type: "DFS",
      DFS: {
        Type: "Remote",
        RemoteRoot: "https://example.com",
      } as EaCRemoteDistributedFileSystem,
    };

    assertEquals(isEaCDFSProcessor(details), true);
  });

  await t.step("Type Guard Check - False", async () => {
    const details = {
      Type: "SomethingElse",
    };

    assertEquals(isEaCDFSProcessor(details), false);
  });
});
