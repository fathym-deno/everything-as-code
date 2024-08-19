import { Octokit } from "./.deps.ts";
import { Branch } from "./types.ts";

/**
 * List the branches of a repository.
 *
 * @param octokit The Octokit instance.
 * @param owner The owner of the repository.
 * @param repo The repository.
 * @returns THe list of branches from a repository.
 */
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
