import { EaCMetadataBase } from "./EaCMetadataBase.ts";

export type EaCVertexDetails = EaCMetadataBase & {
  Description?: string | null;

  Name?: string | null;
};
