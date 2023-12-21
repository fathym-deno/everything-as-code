import { FathymEaC } from "../FathymEaC.ts";

export type EverythingAsCodeState = {
  CloudLookup?: string;

  EaC?: FathymEaC;

  ResourceGroupLookup?: string;

  Username?: string;
} & Record<string, unknown>;
