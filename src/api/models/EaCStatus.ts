import { EaCStatusProcessingTypes } from "./EaCStatusProcessingTypes.ts";

export type EaCStatus = {
  EnterpriseLookup: string;

  EndTime?: Date;

  ID: string;

  Messages: Record<string, string>;

  Processing: EaCStatusProcessingTypes;

  StartTime: Date;

  Username: string;
};
