import { EaCStatusProcessingTypes } from "./EaCStatusProcessingTypes.ts";

export type EaCStatus = {
  EnterpriseLookup: string;

  ID: string;

  Messages: Record<string, string>;

  Processing: EaCStatusProcessingTypes;

  Username: string;
};
