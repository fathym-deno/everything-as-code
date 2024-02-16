import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCProxyProcessor = {
  ProxyRoot: string;
} & EaCProcessor;

export function isEaCProxyProcessor(
  details: unknown,
): details is EaCProxyProcessor {
  const proc = details as EaCProxyProcessor;

  return (
    isEaCProcessor(proc) &&
    proc.ProxyRoot !== undefined &&
    typeof proc.ProxyRoot === "string"
  );
}
