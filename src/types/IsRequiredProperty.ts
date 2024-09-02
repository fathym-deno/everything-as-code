import { HasDetailsProperty } from "./HasDetailsProperty";

export type IsRequiredProperty<
  T,
  K extends keyof T,
> = HasDetailsProperty<T> extends true ? true
  : IsUndefined<T[K]> extends false ? true
  : false;
