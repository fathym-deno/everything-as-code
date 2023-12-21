import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCArtifactDetails = {
  Branches?: string[] | null;

  MainBranch?: string | null;

  Organization?: string | null;

  Repository?: string | null;

  Type: "GITHUB";

  Username?: string | null;
} & EaCVertexDetails;
