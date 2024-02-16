import { EaCProcessor, isEaCProcessor } from "./EaCProcessor.ts";

export type EaCOAuthProcessor = {
  AuthorizationEndpointURI: string;

  ClientID: string;

  ClientSecret: string;

  Scopes: string[];

  TokenURI: string;
} & EaCProcessor;

export function isEaCOAuthProcessor(
  details: unknown,
): details is EaCOAuthProcessor {
  const proc = details as EaCOAuthProcessor;

  return (
    isEaCProcessor(proc) &&
    proc.AuthorizationEndpointURI !== undefined &&
    typeof proc.AuthorizationEndpointURI === "string" &&
    proc.ClientID !== undefined &&
    typeof proc.ClientID === "string" &&
    proc.ClientSecret !== undefined &&
    typeof proc.ClientSecret === "string" &&
    Array.isArray(proc.Scopes) &&
    proc.TokenURI !== undefined &&
    typeof proc.TokenURI === "string"
  );
}
