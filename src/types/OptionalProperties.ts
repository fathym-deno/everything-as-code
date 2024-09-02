import { IsRequiredProperty } from "./IsRequiredProperty.ts";

type OptionalProperties<T> = {
  [
    K in keyof T as IsRequiredProperty<T, K> extends false ? K
      : never
  ]: NonNullable<T[K]>;
};
