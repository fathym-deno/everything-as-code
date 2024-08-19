import { delay, Octokit } from "./.deps.ts";

/**
 * Configure the branch protection rules for a branch in a repository.
 *
 * @param octokit
 * @param owner
 * @param repo
 * @param branch
 * @param defaultBranch
 * @param requireReviews
 * @param requiredStatusChecks
 * @param restrictionTeams
 * @param lockBranch
 * @param username
 */
export async function configureBranchProtection(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  defaultBranch: boolean,
  requireReviews: boolean,
  requiredStatusChecks: string[],
  restrictionTeams: string[],
  lockBranch: boolean,
  username: string,
): Promise<void> {
  await octokit.rest.repos.updateBranchProtection({
    owner: owner,
    repo: repo,
    branch: branch,
    enforce_admins: false,
    lock_branch: lockBranch,
    required_status_checks: {
      strict: true,
      contexts: requiredStatusChecks,
      // checks: requiredStatusChecks.map((check) => {
      //   return { context: check };
      // }),
    },
    required_pull_request_reviews: {
      dismiss_stale_reviews: true,
      require_code_owner_reviews: requireReviews,
      required_approving_review_count: requireReviews ? 1 : 0,
    },
    restrictions: owner === username ? null : {
      teams: restrictionTeams,
      users: [],
    },
  });

  await delay(1000);

  await octokit.rest.repos.update({
    owner: owner,
    repo: repo,
    default_branch: defaultBranch ? branch : undefined,
    delete_branch_on_merge: true,
  });
}
