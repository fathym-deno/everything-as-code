import { createAzureOAuth, createGitHubOAuth } from "../src/services/oAuth.ts";

export const gitHubOAuth = createGitHubOAuth(["admin:org", "user:email"]);

export const azureFathymOAuth = createAzureOAuth(
  "AZURE_FATHYM",
  "http://localhost:5437/signin/callback",
  [
    "openid",
  ],
);

export const azureOAuth = createAzureOAuth(
  "MSAL",
  "http://localhost:5437/signin/callback",
  [
    "https://management.core.windows.net//.default",
  ],
);
