// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { ensureSource } from "./helpers.ts";
import { EaCAPIUserState } from "../../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../../src/api/models/EaCHandlerRequest.ts";
import { EverythingAsCodeSources } from "../../../../../src/eac/modules/sources/EverythingAsCodeSources.ts";
import { EaCSourceActionType } from "../../../../../src/eac/modules/sources/models/EaCSourceActionType.ts";
import { EaCSourceAsCode } from "../../../../../src/eac/modules/sources/EaCSourceAsCode.ts";
import { EaCHandlerResponse } from "../../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCHandlerErrorResponse } from "../../../../../src/api/models/EaCHandlerErrorResponse.ts";
import { EaCGitHubAppDetails } from "../../../../../src/eac/modules/github/EaCGitHubAppDetails.ts";
import { eacGetSecrets } from "../../../../../src/utils/eac/helpers.ts";
import { loadSecretClient } from "../../../../../src/services/azure/key-vault.ts";
import { EverythingAsCodeGitHub } from "../../../../../src/eac/modules/github/EverythingAsCodeGitHub.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx: HandlerContext<any, EaCAPIUserState>) {
    try {
      // const username = ctx.state.Username;

      const handlerRequest: EaCHandlerRequest = await req.json();

      console.log(
        `Processing EaC commit ${handlerRequest.CommitID} Source processes for source ${handlerRequest.Lookup}`,
      );

      const eac: EverythingAsCodeSources = handlerRequest.EaC;

      const currentSources = eac.Sources || {};

      let [sourceLookup, actionValue] = handlerRequest.Lookup.split("|")
        .reverse();

      const action = actionValue as EaCSourceActionType | undefined;

      const current = currentSources[sourceLookup] || {};

      let source = handlerRequest.Model as EaCSourceAsCode;

      if (source.Details) {
        const sourceConnection = eac
          .SourceConnections![
            `${source.Details.Type}://${source.Details.Username!}`
          ];

        const parentEaC: EverythingAsCodeGitHub = handlerRequest.ParentEaC!;

        const gitHubApp =
          parentEaC.GitHubApps![sourceConnection.GitHubAppLookup!];

        const secretClient = await loadSecretClient(
          parentEaC,
          gitHubApp.CloudLookup!,
          gitHubApp.KeyVaultLookup!,
        );

        const secreted = await eacGetSecrets(secretClient, {
          ClientSecret: gitHubApp.Details?.ClientSecret!,
          PrivateKey: gitHubApp.Details?.PrivateKey!,
          WebhooksSecret: gitHubApp.Details?.WebhooksSecret!,
        });

        const gitHubAppDetails = {
          ...gitHubApp.Details,
          ...secreted,
        } as EaCGitHubAppDetails;

        source = await ensureSource(
          gitHubAppDetails,
          sourceConnection,
          sourceLookup,
          current,
          source,
          action,
        );

        sourceLookup = `${source.Details!.Type}://${
          source.Details!.Organization
        }/${source.Details!.Repository}`;
      }

      return respond({
        Checks: [],
        Lookup: sourceLookup,
        Messages: {
          Message: `The source '${sourceLookup}' has been handled.`,
        },
        Model: source,
      } as EaCHandlerResponse);
    } catch (err) {
      console.error(err);

      return respond({
        HasError: true,
        Messages: {
          Error: JSON.stringify(err),
        },
      } as EaCHandlerErrorResponse);
    }
  },
};
