// deno-lint-ignore-file no-explicit-any
import { BaseMessagePromptTemplateLike } from "../../../langchain.deps.ts";
import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCAIChatProcessor = {
  AILookup: string;

  DefaultInput?: any;

  DefaultRAGInput?: any;

  LLMLookup: string;

  EmbeddingsLookup?: string;

  Messages: BaseMessagePromptTemplateLike[];

  UseSSEFormat: boolean;

  VectorStoreLookup?: string;
} & EaCProcessor<"AIChat">;

export function isEaCAIChatProcessor(
  details: unknown,
): details is EaCAIChatProcessor {
  const proc = details as EaCAIChatProcessor;

  return (
    isEaCProcessor("AIChat", proc) &&
    proc.LLMLookup !== undefined &&
    typeof proc.LLMLookup === "string"
  );
}
