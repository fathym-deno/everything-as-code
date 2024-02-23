import { OpenAIBaseInput } from "../../../src.deps.ts";
import { EaCLLMDetails, isEaCLLMDetails } from "./EaCLLMDetails.ts";

export type EaCAzureOpenAILLMDetails = {
  DeploymentName: string;

  InputParams?: Partial<OpenAIBaseInput>;

  ModelName: string;
} & EaCLLMDetails;

export function isEaCAzureOpenAILLMDetails(
  details: unknown,
): details is EaCAzureOpenAILLMDetails {
  const llmDetails = details as EaCAzureOpenAILLMDetails;

  return (
    isEaCLLMDetails(llmDetails) &&
    llmDetails.DeploymentName !== undefined &&
    typeof llmDetails.DeploymentName === "string" &&
    llmDetails.ModelName !== undefined &&
    typeof llmDetails.ModelName === "string"
  );
}