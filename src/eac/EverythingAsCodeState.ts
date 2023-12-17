import { EverythingAsCode } from "./EverythingAsCode.ts";

export type EverythingAsCodeState = {
  EaC?: EverythingAsCode;

  Username?: string;
} & Record<string, unknown>;
