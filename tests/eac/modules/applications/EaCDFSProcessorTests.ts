import { assertEquals } from "../../../test.deps.ts";
import {
  EaCDFSProcessor,
  isEaCDFSProcessor,
} from "../../../../src/eac/modules/applications/EaCDFSProcessor.ts";
import {
  EaCRemoteDistributedFileSystem,
  isEaCRemoteDistributedFileSystem,
} from "../../../../src/eac/modules/applications/EaCRemoteDistributedFileSystem.ts";
import { isEaCNPMDistributedFileSystem } from "../../../../src/eac/modules/applications/EaCNPMDistributedFileSystem.ts";
import { EaCLocalDistributedFileSystem } from "../../../../src/eac/modules/applications/EaCLocalDistributedFileSystem.ts";

Deno.test("EaCDFSProcessor Tests", async (t) => {
  await t.step("Type Guard Check - Local - True", () => {
    const details: EaCDFSProcessor = {
      Type: "DFS",
      DFS: {
        Type: "Remote",
        RemoteRoot: "https://example.com",
      } as EaCRemoteDistributedFileSystem,
    };

    assertEquals(isEaCDFSProcessor(details), true);
    assertEquals(isEaCRemoteDistributedFileSystem(details.DFS), true);
  });

  await t.step("Type Guard Check - Remote - True", () => {
    const details: EaCDFSProcessor = {
      Type: "DFS",
      DFS: {
        Type: "Remote",
        RemoteRoot: "https://example.com",
      } as EaCRemoteDistributedFileSystem,
    };

    assertEquals(isEaCDFSProcessor(details), true);
  });

  await t.step("Type Guard Check - Remote - False", async () => {
    const details = {
      Type: "SomethingElse",
    };

    assertEquals(isEaCDFSProcessor(details), false);
  });

  await t.step("Type Guard Check - Remote - NPM - false", async () => {
    const details: EaCDFSProcessor = {
      Type: "DFS",
      DFS: {
        Type: "SomethingElse",
      },
    };

    assertEquals(isEaCDFSProcessor(details), true);
    assertEquals(isEaCNPMDistributedFileSystem(details), false);
  });
});
