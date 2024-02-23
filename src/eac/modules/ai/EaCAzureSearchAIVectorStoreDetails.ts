import { OpenAIBaseInput } from "../../../src.deps.ts";
import {
  EaCVectorStoreDetails,
  isEaCVectorStoreDetails,
} from "./EaCVectorStoreDetails.ts";

export type EaCAzureSearchAIVectorStoreDetails = {
  APIKey: string;

  Endpoint: string;
} & EaCVectorStoreDetails;

export function isEaCAzureSearchAIVectorStoreDetails(
  details: unknown,
): details is EaCAzureSearchAIVectorStoreDetails {
  const llmDetails = details as EaCAzureSearchAIVectorStoreDetails;

  return (
    isEaCVectorStoreDetails(llmDetails) &&
    llmDetails.APIKey !== undefined &&
    typeof llmDetails.APIKey === "string" &&
    llmDetails.Endpoint !== undefined &&
    typeof llmDetails.Endpoint === "string"
  );
}
