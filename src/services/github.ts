import { createGitHubOAuth } from "./github/githubOAuth.ts";

export const gitHubOAuth = createGitHubOAuth(["admin:org", "user:email"]);
