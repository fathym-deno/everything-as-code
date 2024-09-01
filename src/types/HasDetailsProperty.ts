import { IsObject } from "./.deps.ts";

export type HasDetailsProperty<T> = T extends { Details?: infer U }
  ? IsObject<U>
  : false;
