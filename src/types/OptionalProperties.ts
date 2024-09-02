import { RemoveIndexSignature } from "./.deps.ts";
import { IsRequiredProperty } from "./IsRequiredProperty.ts";

export type OptionalProperties<T> = {
  [
    K in keyof RemoveIndexSignature<T> as IsRequiredProperty<
      RemoveIndexSignature<T>,
      K
    > extends false ? K
      : never
  ]: NonNullable<T[K]>;
};
