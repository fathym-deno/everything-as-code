// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { snakeCase } from "$case";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../src/api/models/EaCHandlerRequest.ts";
import { EverythingAsCodeGitHub } from "../../../../src/eac/modules/github/EverythingAsCodeGitHub.ts";
import { EaCGitHubAppAsCode } from "../../../../src/eac/modules/github/EaCGitHubAppAsCode.ts";
import { loadSecretClient } from "../../../../src/services/azure/key-vault.ts";
import { EaCHandlerResponse } from "../../../../src/api/models/EaCHandlerResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, _ctx: HandlerContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerRequest = await req.json();

    const eac: EverythingAsCodeGitHub = handlerRequest.EaC;

    const currentGitHubApps = eac.GitHubApps || {};

    const gitHubAppLookup = handlerRequest.Lookup;

    const current = currentGitHubApps[gitHubAppLookup] || {};

    const gitHubApp = handlerRequest.Model as EaCGitHubAppAsCode;

    const cloudLookup = gitHubApp.CloudLookup || current.CloudLookup!;

    const keyVaultLookup = gitHubApp.KeyVaultLookup || current.KeyVaultLookup!;

    if (
      gitHubApp.Details &&
      gitHubApp.Details.PrivateKey.startsWith("-----BEGIN RSA PRIVATE KEY-----")
    ) {
      const secretClient = await loadSecretClient(
        eac,
        cloudLookup,
        keyVaultLookup,
      );

      const privateKeySecretName = snakeCase(
        `${eac.EnterpriseLookup!}-${cloudLookup}-github-app-${gitHubAppLookup}`,
      );

      await secretClient.setSecret(
        privateKeySecretName,
        gitHubApp.Details.PrivateKey,
      );

      gitHubApp.Details.PrivateKey = privateKeySecretName;
    }

    return respond({
      Checks: [],
      Lookup: gitHubAppLookup,
      Messages: {
        Message: `The GitHubApp '${gitHubAppLookup}' has been handled.`,
      },
      Model: gitHubApp,
    } as EaCHandlerResponse);
  },
};
