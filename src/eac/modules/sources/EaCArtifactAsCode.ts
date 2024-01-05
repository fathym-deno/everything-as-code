import { EaCDetails } from "../../EaCDetails.ts";
import { EaCArtifactDetails } from "./EaCArtifactDetails.ts";

export type EaCArtifactAsCode = {
  ArtifactLookups?: string[] | null;

  DevOpsActionTriggerLookup?: string | null;
} & EaCDetails<EaCArtifactDetails>;
