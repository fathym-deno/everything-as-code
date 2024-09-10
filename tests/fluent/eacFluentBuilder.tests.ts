import { EverythingAsCode } from "../../src/eac/EverythingAsCode.ts";
import { eacFluentBuilder } from "../../src/fluent/eacFluentBuilder.ts";
import { EverythingAsCodeDatabases } from "../../src/modules/databases/EverythingAsCodeDatabases.ts";
import { assert, assertEquals } from "../test.deps.ts";

// Test for the `eacFluentBuilder` function
Deno.test("Testing eacFluentBuilder functionality", async (t) => {
  await t.step("EnterpriseLookup method test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    // Call the EnterpriseLookup method
    const enterpriseId: string = crypto.randomUUID();
    bldr.EnterpriseLookup(enterpriseId);

    // Verify the exported state
    const exported = bldr.Export();
    assert(exported);
    assertEquals(exported.EnterpriseLookup, enterpriseId);
  });

  await t.step("Details method and Name setting test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    // Set the name in Details
    bldr.Details().Name("My Name");

    // Verify the exported state
    const exported = bldr.Export();
    assert(exported);
    assertEquals(exported.Details!.Name, "My Name");
  });

  await t.step("Handlers method test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    // Call the Handlers method and set values
    bldr.Handlers.$Force(true);
    const handlers = bldr.Handlers("asdfa", true);

    handlers.APIPath("https://api.com").Order(100);

    // Verify the exported state
    const exported = bldr.Export();
    assert(exported);
    assertEquals(exported.Handlers!["asdfa"].APIPath, "https://api.com");
    assertEquals(exported.Handlers!["asdfa"].Order, 100);
    assertEquals(exported.Handlers!.$Force, true);
  });

  await t.step("Database Details method test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    // Set values in Databases Details
    const databaseDetails = bldr.Databases("thinky", true).Details();

    // Verify the exported state
    const exported = bldr.Export();
    assert(exported);
    assert(exported.Databases);
    assert(databaseDetails);
  });

  await t.step("Compile and Export method test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    // Call the Compile method
    bldr.Compile();

    // Export the state
    const eac = bldr.Export();

    // Verify the exported state
    assert(eac);
    // assert(eac.Compile);
  });

  await t.step("Compile and Export method test", () => {
    const bldr = eacFluentBuilder<
      EverythingAsCode & EverythingAsCodeDatabases
    >().Root();

    bldr.EnterpriseLookup(crypto.randomUUID());

    bldr.Details().Name("My Name");

    bldr.Handlers.$Force(true);
    const handlers = bldr.Handlers("asdfa", true);

    handlers.APIPath("https://api.com").Order(100);

    bldr.Databases("thinky", true).Details().Type("Hey");

    bldr.Compile();

    const eac = bldr.Export();

    assert(eac);
    assertEquals(eac.Details!.Name, "My Name");
    assert(eac.Handlers!.$Force);
    assertEquals(eac.Databases!["thinky"]!.Details!.Type, "Hey");
  });
});
