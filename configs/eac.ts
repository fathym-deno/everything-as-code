import { EaCAzureServiceClient } from "../src/eac/client/EaCAzureServiceClient.ts";
import { EaCExplorerServiceClient } from "../src/eac/client/EaCExplorerServiceClient.ts";
import { EaCServiceClient } from "../src/eac/client/EaCServiceClient.ts";
import { jwtConfig } from "./jwt.config.ts";

const eacBaseUrl = Deno.env.get("EAC_API_BASE_URL")!;

export async function loadEaCSvc(eacApiKey: string): Promise<EaCServiceClient>;

export async function loadEaCSvc(
  entLookup: string,
  username: string,
): Promise<EaCServiceClient>;

export async function loadEaCSvc(
  eacApiKeyEntLookup: string,
  username?: string,
): Promise<EaCServiceClient> {
  if (username) {
    eacApiKeyEntLookup = await jwtConfig.Create({
      EnterpriseLookup: eacApiKeyEntLookup,
      Username: username!,
    }, 60 * 60 * 1);
  }

  return new EaCServiceClient(new URL(eacBaseUrl), eacApiKeyEntLookup);
}

export async function loadEaCAzureSvc(
  eacApiKey: string,
): Promise<EaCAzureServiceClient>;

export async function loadEaCAzureSvc(
  entLookup: string,
  username: string,
): Promise<EaCAzureServiceClient>;

export async function loadEaCAzureSvc(
  eacApiKeyEntLookup: string,
  username?: string,
): Promise<EaCAzureServiceClient> {
  if (username) {
    eacApiKeyEntLookup = await jwtConfig.Create({
      EnterpriseLookup: eacApiKeyEntLookup,
      Username: username!,
    }, 60 * 60 * 1);
  }

  return new EaCAzureServiceClient(new URL(eacBaseUrl), eacApiKeyEntLookup);
}

export async function loadEaCExplorerSvc(
  eacApiKey: string,
): Promise<EaCExplorerServiceClient>;

export async function loadEaCExplorerSvc(
  entLookup: string,
  username: string,
): Promise<EaCExplorerServiceClient>;

export async function loadEaCExplorerSvc(
  eacApiKeyEntLookup: string,
  username?: string,
): Promise<EaCExplorerServiceClient> {
  if (username) {
    eacApiKeyEntLookup = await jwtConfig.Create({
      EnterpriseLookup: eacApiKeyEntLookup,
      Username: username!,
    }, 60 * 60 * 1);
  }

  return new EaCExplorerServiceClient(new URL(eacBaseUrl), eacApiKeyEntLookup);
}
