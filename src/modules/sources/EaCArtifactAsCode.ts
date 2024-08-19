import { EaCDetails } from "../../eac/EaCDetails.ts";
import { EaCArtifactDetails } from "./EaCArtifactDetails.ts";

export type EaCArtifactAsCode = {
  ArtifactLookups?: string[];

  DevOpsActionTriggerLookup?: string;

  Parameters?: Record<string, unknown>;
} & EaCDetails<EaCArtifactDetails>;
