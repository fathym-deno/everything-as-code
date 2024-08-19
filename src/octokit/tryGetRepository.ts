import { Octokit } from "./.deps.ts";
import { Repository } from "./types.ts";

/**
 * Try to find a repository.
 *
 * @param octokit The Octokit instance.
 * @param owner The owner of the repository.
 * @param repository The repository.
 * @returns The repository if it exists, otherwise undefined.
 */
export async function tryGetRepository(
  octokit: Octokit,
  owner: string,
  repository: string,
): Promise<Repository | undefined> {
  try {
    const repo = await octokit.rest.repos.get({
      owner: owner,
      repo: repository,
    });

    return repo.data as Repository;
  } catch {
    return undefined;
  }
}
