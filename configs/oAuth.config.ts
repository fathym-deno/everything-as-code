import {
  createAzureADB2COAuth,
  createAzureADOAuth,
  createGitHubOAuth,
} from "../src/services/oAuth.ts";

const baseUrl = Deno.env.get("BASE_URL")!;

export const gitHubOAuth = createGitHubOAuth(["admin:org", "user:email"]);

export const azureFathymOAuth = createAzureADB2COAuth(
  `${baseUrl}/signin/callback`,
  ["openid"],
);

export const azureOAuth = createAzureADOAuth(
  `${baseUrl}/signin/callback`,
  ["https://management.core.windows.net//.default"],
);
