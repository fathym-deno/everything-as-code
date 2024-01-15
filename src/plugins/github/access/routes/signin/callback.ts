// deno-lint-ignore-file no-explicit-any
import { Handlers } from "$fresh/server.ts";
import { fathymDenoKv } from "../../../../../../configs/deno-kv.config.ts";
import { loadMainOctokit } from "../../../../../services/github/octokit/load.ts";
import { EaCSourceConnectionDetails } from "../../../../../eac/modules/sources/EaCSourceConnectionDetails.ts";
import { UserOAuthConnection } from "../../../../../oauth/UserOAuthConnection.ts";
import { EverythingAsCodeState } from "../../../../../eac/EverythingAsCodeState.ts";
import { loadEaCSvc } from "../../../../../../configs/eac.ts";
import { waitForStatus } from "../../../../../utils/eac/waitForStatus.ts";
import { OAuthHelpers } from "../../../../../services/oAuth.ts";

export function establishSigninCallbackRoute(oAuthHandlers: OAuthHelpers) {
  const handler: Handlers<any, EverythingAsCodeState> = {
    async GET(req, ctx) {
      const now = Date.now();

      const { response, tokens } = await oAuthHandlers.handleCallback(req);

      const { accessToken, refreshToken, expiresIn } = tokens;

      const expiresAt = now + expiresIn! * 1000;

      const octokit = await loadMainOctokit({
        Token: accessToken,
      } as EaCSourceConnectionDetails);

      const {
        data: { login },
      } = await octokit.rest.users.getAuthenticated();

      await fathymDenoKv.set(
        ["User", "Current", "GitHub", "GitHubConnection"],
        {
          RefreshToken: refreshToken,
          Token: accessToken,
          Username: login,
          ExpiresAt: expiresAt,
        } as UserOAuthConnection,
        {
          expireIn: expiresIn! * 1000,
        },
      );

      const srcConnLookup = `GITHUB://${login}`;

      let srcConnDetails: EaCSourceConnectionDetails;

      if (
        ctx.state.EaC?.SourceConnections &&
        ctx.state.EaC.SourceConnections[srcConnLookup]
      ) {
        srcConnDetails = ctx.state.EaC.SourceConnections[srcConnLookup]!
          .Details!;
      } else {
        srcConnDetails = {
          Name: `${login} GitHub Connection`,
          Description: `The GitHub connection to use for user ${login}.`,
        } as EaCSourceConnectionDetails;
      }

      srcConnDetails.ExpiresAt = expiresAt;

      srcConnDetails.Token = accessToken;

      srcConnDetails.RefreshToken = refreshToken!;

      const eacSvc = await loadEaCSvc(
        ctx.state.EaC!.EnterpriseLookup!,
        ctx.state.Username!,
      );

      const commitResp = await eacSvc.Commit(
        {
          EnterpriseLookup: ctx.state.EaC!.EnterpriseLookup!,
          SourceConnections: {
            [srcConnLookup]: {
              Details: srcConnDetails,
            },
          },
        },
        60,
      );

      await waitForStatus(
        eacSvc,
        commitResp.EnterpriseLookup,
        commitResp.CommitID,
      );

      return response;
    },
  };

  return { handler, component: undefined };
}
