import { BaseMessagePromptTemplateLike } from "../../../src.deps.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCAIRAGChatProcessor = {
  LLMLookup: string;

  EmbeddingsLookup: string;

  Messages: BaseMessagePromptTemplateLike[];

  UseSSEFormat: boolean;

  VectorStoreLookup: string;
} & EaCProcessor;

export function isEaCAIRAGChatProcessor(
  details: unknown,
): details is EaCAIRAGChatProcessor {
  const proc = details as EaCAIRAGChatProcessor;

  return (
    isEaCProcessor(proc) &&
    proc.LLMLookup !== undefined &&
    typeof proc.LLMLookup === "string" &&
    proc.EmbeddingsLookup !== undefined &&
    typeof proc.EmbeddingsLookup === "string" &&
    proc.VectorStoreLookup !== undefined &&
    typeof proc.VectorStoreLookup === "string"
  );
}
