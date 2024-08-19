import { EaCVertexDetails } from "../../eac/EaCVertexDetails.ts";

export type EaCSourceDetails = {
  Branches?: string[];

  MainBranch?: string;

  Organization?: string;

  Repository?: string;

  Type: "GITHUB";

  Username?: string;
} & EaCVertexDetails;
