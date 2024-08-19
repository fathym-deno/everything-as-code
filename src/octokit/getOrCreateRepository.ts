// deno-lint-ignore-file no-explicit-any
import { EaCSourceDetails, Octokit } from "./.deps.ts";
import { tryGetRepository } from "./tryGetRepository.ts";
import { NewRepository, Repository } from "./types.ts";

export async function getOrCreateRepository(
  octokit: Octokit,
  details: EaCSourceDetails,
): Promise<Repository> {
  let repo = await tryGetRepository(
    octokit,
    details.Organization!,
    details.Repository!,
  );

  if (!repo) {
    const newRepo: NewRepository = {
      name: details.Repository!,
      delete_branch_on_merge: true,
      auto_init: true,
      license_template: "mit",
    } as NewRepository;

    if (details.Organization !== details.Username) {
      newRepo.org = details.Organization!;

      const createResp = await octokit.rest.repos.createInOrg(newRepo);

      repo = createResp.data as any;
    } else {
      const createResp = await octokit.rest.repos.createForAuthenticatedUser(
        newRepo,
      );

      repo = createResp.data as any;
    }
  }

  return repo!;
}
