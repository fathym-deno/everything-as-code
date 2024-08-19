import { Octokit } from "./.deps.ts";
import { Branch } from "./types.ts";

export async function getBranch(
  octokit: Octokit,
  owner: string,
  repo: string,
  branchName: string,
): Promise<Branch> {
  const branchResp = await octokit.rest.repos.getBranch({
    owner: owner,
    repo: repo,
    branch: branchName,
  });

  return branchResp.data;
}
