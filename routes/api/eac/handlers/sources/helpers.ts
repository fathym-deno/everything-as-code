import { EaCGitHubAppDetails } from "../../../../../src/eac/modules/github/EaCGitHubAppDetails.ts";
import { EaCSourceAsCode } from "../../../../../src/eac/modules/sources/EaCSourceAsCode.ts";
import { EaCSourceConnectionAsCode } from "../../../../../src/eac/modules/sources/EaCSourceConnectionAsCode.ts";
import { EaCSourceActionType } from "../../../../../src/eac/modules/sources/models/EaCSourceActionType.ts";
import {
  configureRepository,
  getOrCreateRepository,
  tryGetRepository,
} from "../../../../../src/services/github/octokit/helpers.ts";
import { loadOctokit } from "../../../../../src/services/github/octokit/load.ts";

export async function ensureSource(
  gitHubAppDetails: EaCGitHubAppDetails,
  connection: EaCSourceConnectionAsCode,
  sourceLookup: string,
  currentSource: EaCSourceAsCode,
  source: EaCSourceAsCode,
  action?: EaCSourceActionType,
): Promise<EaCSourceAsCode> {
  const octokit = await loadOctokit(gitHubAppDetails, connection.Details!);

  let repository = await tryGetRepository(
    octokit,
    source.Details!.Organization!,
    source.Details!.Repository!,
  );

  if (action && !repository) {
    const [type, orgRepo] = sourceLookup.split("://");

    const [organizationName, repositoryName] = orgRepo.split("/");

    switch (action) {
      case "fork": {
        const org = source.Details!.Organization === source.Details!.Username
          ? undefined
          : source.Details!.Organization!;

        const forkResp = await octokit.rest.repos.createFork({
          owner: organizationName,
          repo: repositoryName,
          organization: org,
          name: source.Details!.Repository!,
        });

        repository = await tryGetRepository(
          octokit,
          source.Details!.Organization!,
          source.Details!.Repository!,
        );
        break;
      }

      case "import": {
        break;
      }

      case "template": {
        const tempResp = await octokit.rest.repos.createUsingTemplate({
          template_owner: organizationName,
          template_repo: repositoryName,
          owner: source.Details!.Organization!,
          name: source.Details!.Repository!,
        });

        repository = tempResp.data!;

        break;
      }

      default: {
        repository = await getOrCreateRepository(octokit, source.Details!);
        break;
      }
    }
  }

  if (repository) {
    repository = await configureRepository(
      octokit,
      repository,
      source.Details!,
    );
  }

  return source;
}
