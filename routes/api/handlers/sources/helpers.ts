import { EaCSourceAsCode } from "../../../../src/eac/modules/sources/EaCSourceAsCode.ts";
import { EaCSourceConnectionAsCode } from "../../../../src/eac/modules/sources/EaCSourceConnectionAsCode.ts";
import { EaCSourceActionType } from "../../../../src/eac/modules/sources/models/EaCSourceActionType.ts";
import {
  configureRepository,
  getOrCreateRepository,
} from "../../../../src/services/github/octokit/helpers.ts";
import { loadOctokit } from "../../../../src/services/github/octokit/load.ts";

export async function ensureSource(
  connection: EaCSourceConnectionAsCode,
  sourceLookup: string,
  currentSource: EaCSourceAsCode,
  source: EaCSourceAsCode,
  action?: EaCSourceActionType,
): Promise<EaCSourceAsCode> {
  const octokit = await loadOctokit(connection.Details!);

  let repository = await getOrCreateRepository(octokit, source.Details!);

  if (action) {
    switch (action) {
      case "fork": {
        //         const forkResp = await octokit.rest.repos.createFork({
        //           ow
        // // owner: source.Details!.Organization!,
        // // repo: source.Details!.Repository!,

        //         });

        // repository = forkResp.data!;
        break;
      }

      case "import": {
        break;
      }

      case "template": {
        break;
      }
    }
  }

  repository = await configureRepository(octokit, repository, source.Details!);

  return source;
}
