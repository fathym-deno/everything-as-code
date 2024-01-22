// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers, Status } from "$fresh/server.ts";
import { merge, respond } from "@fathym/common";
import jsonpath from "npm:jsonpath";
import { EaCAPIUserState } from "../../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerRequest } from "../../../../../src/api/models/EaCHandlerRequest.ts";
import { EaCHandlerResponse } from "../../../../../src/api/models/EaCHandlerResponse.ts";
import { EaCSecretAsCode } from "../../../../../src/eac/EaCSecretAsCode.ts";
import { loadSecretClient } from "../../../../../src/services/azure/key-vault.ts";
import { EverythingAsCodeClouds } from "../../../../../src/eac/modules/clouds/EverythingAsCodeClouds.ts";
import { EverythingAsCode } from "../../../../../src/eac/EverythingAsCode.ts";
import { eacSetSecrets } from "../../../../../src/utils/eac/helpers.ts";
import { loadConnections } from "../../../../../src/utils/eac/loadConnections.ts";
import { EaCMetadataBase } from "../../../../../src/eac/EaCMetadataBase.ts";
import { EverythingAsCodeIoT } from "../../../../../src/eac/modules/iot/EverythingAsCodeIoT.ts";
import { EaCCloudAsCode } from "../../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { formatParameters } from "../clouds/helpers.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to commit update changes to an EaC Environments container.
   * @param req
   * @param _ctx
   * @returns
   */
  async POST(req, ctx: HandlerContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerRequest = await req.json();

    console.log(
      `Processing EaC commit ${handlerRequest.CommitID} Secret processes for secret ${handlerRequest.Lookup}`,
    );

    const eac: EverythingAsCodeClouds & EverythingAsCode = handlerRequest.EaC;

    const currentSecrets = eac.Secrets || {};

    const secretLookup = handlerRequest.Lookup;

    const current = currentSecrets[secretLookup] || {};

    const secretDef = handlerRequest.Model as EaCSecretAsCode;

    let secretValue = secretDef.Details?.Value;

    if (secretValue && !secretValue.startsWith("$secret:")) {
      if (secretValue.startsWith("$connections:")) {
        const eacConnections:
          & EverythingAsCodeClouds
          & EverythingAsCodeIoT
          & EverythingAsCode = {};

        const connKeys = ["Clouds", "GitHubApps", "IoT"];

        const connCalls = connKeys.map((key) => {
          return (async () => {
            const handler = eac.Handlers![key];

            const lookups = Object.keys(eac[key] || {});

            const current = lookups.reduce((prev, cur) => {
              prev![cur] = {};
              return prev;
            }, {} as Record<string, EaCMetadataBase>);

            const conns = await loadConnections(
              eac,
              handler!,
              ctx.state.JWT!,
              current,
              eac.Clouds!,
              lookups,
            );

            eacConnections[key] = conns;
          })();
        });

        await Promise.all(connCalls);

        const template = secretValue.replace("$connections:", "");

        secretValue = jsonpath.value({ eac: eacConnections }, template);
      }

      const secretClient = await loadSecretClient(
        eac,
        secretDef.CloudLookup || current.CloudLookup!,
        secretDef.KeyVaultLookup || current.KeyVaultLookup!,
      );

      const secreted = await eacSetSecrets(secretClient, secretLookup, {
        Value: secretValue,
      });

      secretDef.Details = merge(current.Details!, {
        Value: secreted.Value,
      });
    }

    return respond({
      Checks: [],
      Lookup: secretLookup,
      Messages: {
        Message: `The secret '${secretLookup}' has been handled.`,
      },
      Model: secretDef,
    } as EaCHandlerResponse);
  },
};
