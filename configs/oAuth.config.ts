import { createAzureOAuth, createGitHubOAuth } from "../src/services/oAuth.ts";

const baseUrl = Deno.env.get("BASE_URL")!;

export const gitHubOAuth = createGitHubOAuth(["admin:org", "user:email"]);

export const azureFathymOAuth = createAzureOAuth(
  "AZURE_FATHYM",
  `${baseUrl}/signin/callback`,
  [
    "openid",
  ],
);

export const azureOAuth = createAzureOAuth(
  "MSAL",
  `${baseUrl}/signin/callback`,
  [
    "https://management.core.windows.net//.default",
  ],
);
