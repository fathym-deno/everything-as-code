import { IsRequiredProperty } from "./IsRequiredProperty.ts";

export type OptionalProperties<T> = {
  [
    K in keyof T as IsRequiredProperty<T, K> extends false ? K
      : never
  ]: NonNullable<T[K]>;
};
