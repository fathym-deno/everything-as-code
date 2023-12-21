import { EaCServiceClient } from "../src/eac/client/EaCServiceClient.ts";
import { eacBaseUrl } from "./eac.ts";

export async function loadEaCSvc(eacApiKey: string): Promise<EaCServiceClient>;

export async function loadEaCSvc(
  entLookup: string,
  username: string,
): Promise<EaCServiceClient>;

export async function loadEaCSvc(
  eacApiKeyEntLookup: string,
  username?: string,
): Promise<EaCServiceClient> {
  if (!username) {
    const jwt = await jwtConfig.Create({
      EnterpriseLookup: ctx.state.EaC!.EnterpriseLookup,
      Username: ctx.state.Username,
    });
  }
  return new EaCServiceClient(new URL(eacBaseUrl), eacApiKey);
}
