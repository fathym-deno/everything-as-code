import { Octokit } from "./.deps.ts";
import { Repository } from "./types.ts";

export async function tryGetRepository(
  octokit: Octokit,
  organization: string,
  repository: string,
): Promise<Repository | undefined> {
  try {
    const repo = await octokit.rest.repos.get({
      owner: organization,
      repo: repository,
    });

    return repo.data as Repository;
  } catch {
    return undefined;
  }
}
