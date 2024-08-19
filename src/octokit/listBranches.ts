import { Octokit } from "./.deps.ts";
import { Branch } from "./types.ts";

export async function listBranches(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<Branch[]> {
  const branchesResp = await octokit.rest.repos.listBranches({
    owner: owner,
    repo: repo,
  });

  return branchesResp.data;
}
