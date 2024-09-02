import { IsRequiredProperty } from "./IsRequiredProperty.ts";

export type RequiredProperties<T> = {
  [K in keyof T as IsRequiredProperty<T, K> extends true ? K : never]:
    NonNullable<T[K]>;
};
