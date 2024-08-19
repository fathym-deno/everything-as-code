import { type EaCSourceDetails, Octokit } from "./.deps.ts";
import { configureBranchProtection } from "./configureBranchProtection.ts";
import { getBranch } from "./getBranch.ts";
import { listBranches } from "./listBranches.ts";
import { tryGetRepository } from "./tryGetRepository.ts";
import { Repository } from "./types.ts";

/**
 * Configure a repository with the specified setup.
 *
 * @param octokit The Octokit instance to configure the repository in.
 * @param repo The repository to configure.
 * @param sourceDetails The source details.
 * @returns The configured repository.
 */
export async function configureRepository(
  octokit: Octokit,
  repo: Repository,
  sourceDetails: EaCSourceDetails,
): Promise<Repository> {
  const masterBranchName = repo.master_branch || "main";

  const integrationBranchName = "integration";

  const masterBranch = await getBranch(
    octokit,
    sourceDetails.Organization!,
    sourceDetails.Repository!,
    masterBranchName,
  );

  const branches = await listBranches(
    octokit,
    sourceDetails.Organization!,
    sourceDetails.Repository!,
  );

  if (!branches.some((br) => br.name === integrationBranchName)) {
    await octokit.rest.git.createRef({
      owner: sourceDetails.Organization!,
      repo: sourceDetails.Repository!,
      ref: `refs/heads/${integrationBranchName}`,
      sha: masterBranch.commit.sha,
    });
  }

  const requiredStatusChecks: string[] = [
    "continuous-integration",
    "code-review",
  ];

  const restrictionTeams: string[] = ["code-owners"];

  await configureBranchProtection(
    octokit,
    sourceDetails.Organization!,
    sourceDetails.Repository!,
    integrationBranchName,
    false,
    true,
    requiredStatusChecks,
    restrictionTeams,
    true,
    sourceDetails.Username!,
  );

  await configureBranchProtection(
    octokit,
    sourceDetails.Organization!,
    sourceDetails.Repository!,
    masterBranchName,
    true,
    false,
    requiredStatusChecks,
    restrictionTeams,
    false,
    sourceDetails.Username!,
  );

  repo = (await tryGetRepository(
    octokit,
    sourceDetails.Organization!,
    sourceDetails.Repository!,
  ))!;

  return repo;
}
