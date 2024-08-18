import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCProxyProcessor = {
  Headers?: Record<string, string>;

  ProxyRoot: string;

  RedirectMode?: "error" | "follow" | "manual";
} & EaCProcessor<"Proxy">;

export function isEaCProxyProcessor(proc: unknown): proc is EaCProxyProcessor {
  const x = proc as EaCProxyProcessor;

  return (
    isEaCProcessor("Proxy", x) &&
    x.ProxyRoot !== undefined &&
    typeof x.ProxyRoot === "string"
  );
}
