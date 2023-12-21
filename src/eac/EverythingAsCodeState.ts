import { WithSession } from "$fresh/session";
import { FathymEaC } from "../FathymEaC.ts";

export type EverythingAsCodeState =
  & {
    CloudLookup?: string;

    EaC?: FathymEaC;

    ResourceGroupLookup?: string;

    Username?: string;
  }
  & WithSession
  & Record<string, unknown>;
