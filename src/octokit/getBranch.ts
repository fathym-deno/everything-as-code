import { Octokit } from "./.deps.ts";
import { Branch } from "./types.ts";

/**
 * Get a branch from a repository.
 *
 * @param octokit The Octokit instance.
 * @param owner The owner of the repository.
 * @param repo The repository where the branch resides.
 * @param branchName The name of the branch.
 * @returns The branch.
 */
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
