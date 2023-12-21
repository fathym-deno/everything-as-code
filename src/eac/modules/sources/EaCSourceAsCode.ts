import { EaCDetails } from "../../EaCDetails.ts";
import { EaCSourceDetails } from "./EaCSourceDetails.ts";

export type EaCSourceAsCode = {
  DevOpsActionTriggerLookups?: string[] | null;
} & EaCDetails<EaCSourceDetails>;
