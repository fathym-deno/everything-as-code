import { IsUndefined } from "./.deps.ts";
import { HasDetailsProperty } from "./HasDetailsProperty.ts";

export type IsRequiredProperty<
  T,
  K extends keyof T,
> = HasDetailsProperty<T> extends true ? true
  : IsUndefined<T[K]> extends false ? true
  : false;
