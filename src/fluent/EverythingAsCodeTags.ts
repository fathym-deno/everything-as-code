// deno-lint-ignore-file no-explicit-any
import { EaCDetails } from "../eac/EaCDetails.ts";
import { EaCEnterpriseDetails } from "../eac/EaCEnterpriseDetails.ts";
import { EverythingAsCodeDatabases } from "../modules/databases/EverythingAsCodeDatabases.ts";
import { RemoveIndexSignatures } from "../types/.deps.ts";
import {
  $FluentTag,
  EaCVertexDetails,
  EverythingAsCode,
  HasTypeCheck,
  IoCContainer,
  IsNativeType,
  IsObject,
  ValueType,
} from "./.deps.ts";
import { eacFluentBuilder } from "./EaCFluentBuilder.ts";

export type EverythingAsCodeTags<T> = true extends IsObject<T>
  ? false extends IsNativeType<T> ? EaCObjectTags<T>
  : T
  : T;

type EaCObjectTags<T> =
  & T
  & EaCStandardTags<T>
  & EaCVertexDetailsTags<T>
  & EaCAsCodeTags<T>;

type EaCStandardTags<T> =
  & {
    [K in keyof T as K extends "Details" ? never : K]: EverythingAsCodeTags<
      T[K]
    >;
  }
  & $FluentTag<
    "Methods",
    never,
    "handlers",
    {
      handlers: {
        Compile: () => IoCContainer;
      };
    }
  >;

type EaCVertexDetailsTags<T> = [
  HasTypeCheck<NonNullable<T>, EaCVertexDetails>,
] extends [true] ? {
    [K in keyof T as K extends "Details" ? K : never]: EverythingAsCodeTags<
      T[K] & $FluentTag<"Methods", "Object">
    >;
  }
  : {};

type EaCAsCodeTags<T> = [
  HasTypeCheck<NonNullable<T>, EaCDetails<any>>,
] extends [true] ? {
    [K in keyof T]: "Details" extends keyof T[K]
      ? EverythingAsCodeTags<T[K] & $FluentTag<"Methods", "Object">>
      : {};
  }
  : {};

type z = EaCAsCodeTags<EverythingAsCodeTags<EverythingAsCode>>;

const bldr = eacFluentBuilder<
  EverythingAsCode & EverythingAsCodeDatabases
>().Root();

type x = EaCVertexDetailsTags<EverythingAsCode["Details"]>;

bldr.EnterpriseLookup(crypto.randomUUID());

bldr.Details().Name("My Name");

bldr._Handlers.$Force(true);
const handlers = bldr._Handlers("asdfa");

handlers.APIPath("https://api.com").Order(100);

bldr._Databases("thinky").Details()["@Methods"]("Object");

bldr.Compile();

const eac = bldr.Export();
