import { EaCDetails } from "../../EaCDetails.ts";
import { EaCArtifactDetails } from "./EaCArtifactDetails.ts";

export type EaCArtifactAsCode = {
  Type: string | null;
} & EaCDetails<EaCArtifactDetails>;
