import { $FluentTag, IoCContainer, IsNativeType, IsObject } from "./.deps.ts";

export type EverythingAsCodeTags<T> = true extends IsObject<T>
  ? false extends IsNativeType<T> ? EaCObjectTags<T>
  : T
  : T;

type EaCObjectTags<T> =
  & T
  & {
    [K in keyof T]: EverythingAsCodeTags<T[K]>;
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

// const bldr = eacFluentBuilder<
//   EverythingAsCode & EverythingAsCodeDatabases
// >().Root();

// bldr.EnterpriseLookup(crypto.randomUUID());

// bldr.Details().Name('My Name');

// bldr._Handlers.$Force(true);
// const handlers = bldr._Handlers('asdfa');

// type z = typeof handlers;

// handlers.APIPath('https://api.com').Order(100);

// bldr._Databases('thinky');
