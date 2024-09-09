import {
  $FluentTag,
  IsNativeType,
  IsObject,
} from './.deps.ts';

export type EverythingAsCodeTags<T> = true extends IsObject<T>
  ? false extends IsNativeType<T>
    ? EaCObjectTags<T>
    : T
  : T;

// type EaCModuleHandlersTags<T> = true extends HasTypeCheck<
//   NonNullable<T>,
//   EaCModuleHandlers
// >
//   ? T & $FluentTag<'Methods', 'Record'>
//   : T;

type EaCObjectTags<T> = T & {
  [K in keyof T]: EverythingAsCodeTags<T[K]>;
} 
& $FluentTag<
    'Methods',
    never,
    'handlers',
    {
      handlers: {
        Compile: () => unknown;
      };
    }
  >
  ;
// &
//   EaCModuleHandlersTags<T>;

// // type xxxx = EaCModuleHandlersTags<EverythingAsCode['Handlers']>;
// type xxx = EaCObjectTags<EverythingAsCode['Handlers']>;
// type xx = EaCObjectTags<EverythingAsCode>;
// type x = EverythingAsCodeTags<EverythingAsCode>;

// // const c: x = {
// //   Details: {},
// //   EnterpriseLookup: '',
// //   Handlers: {
// //     '@Methods': 'Record',
// //     $Force: true,
// //   },
// //   ParentEnterpriseLookup: '',
// // };

// const bldr = eacFluentBuilder<
//   EverythingAsCode & EverythingAsCodeDatabases
// >().Root();

// bldr.EnterpriseLookup(crypto.randomUUID());

// bldr.Details().Name('My Name');

// type yyy = FluentMethodsRecordReturnType<
//   x,
//   'Handlers',
//   ValueType<x['Handlers']>,
//   x
// >;

// type u = x['Handlers']
// type U = ValueType<u>;

// type xyyy = SelectFluentMethods<
//   U,
//   x
// >;
// type xxyyy = {
//   [K in keyof U as K extends string
//     ? DetermineFluentMethodsType<U, K> extends 'Record'
//       ? `_${K}`
//       : K
//     : never]: DetermineEaCFluentMethods<U, K, x>;
// };

// type yyyy = FluentMethodsObjectReturnType<x, 'Details', x['Details'], x>;

// bldr._Handlers.$Force(true);
// const handlers = bldr._Handlers('asdfa');

// type z = typeof handlers;

// handlers.APIPath('https://api.com').Order(100);

// bldr._Databases('thinky');
