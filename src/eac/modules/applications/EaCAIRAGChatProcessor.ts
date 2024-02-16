import { BaseMessagePromptTemplateLike, OpenAIBaseInput } from "../../../src.deps.ts";
import { isEaCProcessor, EaCProcessor } from './EaCProcessor.ts';

export type EaCAIRAGChatProcessor = {
  APIKey: string;
  
  DeploymentName: string;
  
  EmbeddingDeploymentName: string;
  
  Endpoint: string;

  InputParams?: Partial<OpenAIBaseInput>;

  Messages: BaseMessagePromptTemplateLike[]
  
  ModelName: string;

  SearchEndpoint: string;

  SearchAPIKey: string;

  UseSSEFormat: boolean;
  } & EaCProcessor;

export function isEaCAIRAGChatProcessor(
  details: unknown
): details is EaCAIRAGChatProcessor {
  const proc = details as EaCAIRAGChatProcessor;

  return (
    isEaCProcessor(proc) &&
    proc.APIKey !== undefined &&
    typeof proc.APIKey === 'string'&&
    proc.DeploymentName !== undefined &&
    typeof proc.DeploymentName === 'string'&&
    proc.EmbeddingDeploymentName !== undefined &&
    typeof proc.EmbeddingDeploymentName === 'string' &&
    proc.Endpoint !== undefined &&
    typeof proc.Endpoint === 'string' &&
    proc.ModelName !== undefined &&
    typeof proc.ModelName === 'string'
  );
}
