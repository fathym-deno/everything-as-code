// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerConnectionsRequest } from "../../../../src/api/models/EaCHandlerConnectionsRequest.ts";
import { EverythingAsCodeSources } from "../../../../src/eac/modules/sources/EverythingAsCodeSources.ts";
import { EverythingAsCodeClouds } from "../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EverythingAsCodeGitHub } from "../../../../src/eac/modules/github/EverythingAsCodeGitHub.ts";
import { EaCSourceConnectionAsCode } from "../../../../src/eac/modules/sources/EaCSourceConnectionAsCode.ts";
import { loadOctokit } from "../../../../src/services/github/octokit/load.ts";
import { EaCHandlerConnectionsResponse } from "../../../../src/api/models/EaCHandlerConnectionsResponse.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async POST(req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerConnectionsRequest = await req.json();

    const eac:
      & EverythingAsCodeSources
      & EverythingAsCodeClouds
      & EverythingAsCodeGitHub = handlerRequest.EaC;

    const sourceConnDef = handlerRequest.Model as EaCSourceConnectionAsCode;

    const sourceConn = handlerRequest.Current as EaCSourceConnectionAsCode;

    const gitHubAppDetails = eac.GitHubApps![sourceConn.GitHubAppLookup!]
      .Details!;

    const octokit = await loadOctokit(
      eac,
      gitHubAppDetails,
      sourceConn.Details!,
    );

    const organizationLookups = Object.keys(sourceConnDef.Organizations || {});

    const [_type, username] = handlerRequest.Lookup.split("://");

    const organizations: Record<
      string,
      Record<
        string,
        {
          Branches: string[];
        }
      >
    > = {
      [username]: {},
    };

    const query = `query paginate($cursor: String) {
      viewer {
        organizations(first: 100, after: $cursor) {
          nodes {
            login
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }`;

    try {
      const result = await octokit.graphql.paginate(query);

      result.viewer.organizations.nodes.forEach((org: any) => {
        organizations[org.login] = {};
      });
    } catch (err) {
      err.toString();
    }

    return respond({
      Model: {
        Organizations: organizations,
      } as EaCSourceConnectionAsCode,
    } as EaCHandlerConnectionsResponse);
  },
};
