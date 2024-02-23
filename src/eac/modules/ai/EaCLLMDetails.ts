import { EaCVertexDetails } from "../../EaCVertexDetails.ts";

export type EaCLLMDetails = {
  APIKey: string;

  Endpoint: string;
} & EaCVertexDetails;

export function isEaCLLMDetails(details: unknown): details is EaCLLMDetails {
  const llmDetails = details as EaCLLMDetails;

  return (
    llmDetails &&
    llmDetails.APIKey !== undefined &&
    typeof llmDetails.APIKey === "string" &&
    llmDetails.Endpoint !== undefined &&
    typeof llmDetails.Endpoint === "string"
  );
}
