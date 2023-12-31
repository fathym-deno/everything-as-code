import { EaCDetails } from "../../EaCDetails.ts";
import { EaCDevOpsActionDetails } from "./EaCDevOpsActionDetails.ts";

export type EaCDevOpsActionAsCode = {
  ArtifactLookups?: string[] | null;

  DevOpsActionTriggerLookups?: string[] | null;
} & EaCDetails<EaCDevOpsActionDetails>;
