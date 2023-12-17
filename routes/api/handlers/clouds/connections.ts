// deno-lint-ignore-file no-explicit-any
import { HandlerContext, Handlers } from "$fresh/server.ts";
import { respond } from "@fathym/common";
import {
  GenericResourceExpanded,
  ResourceManagementClient,
} from "npm:@azure/arm-resources";
import { ClientSecretCredential } from "npm:@azure/identity";
import { EaCAPIUserState } from "../../../../src/api/EaCAPIUserState.ts";
import { EaCHandlerConnectionsRequest } from "../../../../src/api/models/EaCHandlerConnectionsRequest.ts";
import { EaCCloudAsCode } from "../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCHandlerConnectionsResponse } from "../../../../src/api/models/EaCHandlerConnectionsResponse.ts";
import { EaCCloudResourceGroupAsCode } from "../../../../src/eac/modules/clouds/EaCCloudResourceGroupAsCode.ts";
import { loadAzureCloudCredentials } from "../../../../src/utils/eac/loadAzureCloudCredentials.ts";
import { EaCCloudAzureDetails } from "../../../../src/eac/modules/clouds/EaCCloudAzureDetails.ts";
import { loadResoureTypeApiVersions } from "../../../../src/services/azure/loadResoureTypeApiVersions.ts";
import { EaCCloudResourceAsCode } from "../../../../src/eac/modules/clouds/EaCCloudResourceAsCode.ts";

export const handler: Handlers = {
  /**
   * Use this endpoint to retrieve locations for the provided services.
   * @param _req
   * @param ctx
   * @returns
   */
  async POST(req: Request, ctx: HandlerContext<any, EaCAPIUserState>) {
    const handlerRequest: EaCHandlerConnectionsRequest = await req.json();

    const cloudDef = handlerRequest.Model as EaCCloudAsCode;

    let resGroupLookups = Object.keys(cloudDef.ResourceGroups || {});

    const cloud = handlerRequest.Current as EaCCloudAsCode;

    if (resGroupLookups.length === 0) {
      resGroupLookups = Object.keys(cloud.ResourceGroups || {});
    }

    return respond({
      Model: {
        ResourceGroups: await loadCloudResourceGroupsConnections(
          cloud,
          cloudDef.ResourceGroups || {},
          cloud.ResourceGroups || {},
          resGroupLookups,
        ),
      } as EaCCloudAsCode,
    } as EaCHandlerConnectionsResponse);
  },
};

async function loadCloudResourceGroupsConnections(
  cloud: EaCCloudAsCode,
  resGroupsDef: Record<string, EaCCloudResourceGroupAsCode>,
  resGroups: Record<string, EaCCloudResourceGroupAsCode>,
  resGroupLookups: string[],
): Promise<Record<string, EaCCloudResourceGroupAsCode>> {
  const creds = await loadAzureCloudCredentials(cloud);

  const details = cloud.Details as EaCCloudAzureDetails;

  const resClient = new ResourceManagementClient(creds, details.SubscriptionID);

  const mappedCalls = resGroupLookups!.map(async (resGroupLookup) => {
    const resGroupDef = resGroupsDef ? resGroupsDef[resGroupLookup] : {};

    let resLookups = Object.keys(resGroupDef.Resources || {});

    const resGroup = resGroups![resGroupLookup];

    if (resLookups.length === 0) {
      resLookups = Object.keys(resGroup.Resources || {});
    }

    const resGroupAzureResourcesResult = await resClient.resources
      .listByResourceGroup(resGroupLookup);

    const resGroupAzureResources: GenericResourceExpanded[] = [];

    for await (const resGroupAzureResource of resGroupAzureResourcesResult) {
      resGroupAzureResources.push(resGroupAzureResource);
    }

    const apiVersions = await loadResoureTypeApiVersions(
      resClient,
      resGroupAzureResources.map((rgar) => rgar.type!),
    );

    return {
      ResourceGroupLookup: resGroupLookup,
      ResourceGroup: {
        Resources: await loadCloudResourcesConnections(
          creds,
          resGroupAzureResources,
          apiVersions,
          resGroupDef.Resources || {},
          resGroup.Resources || {},
          resLookups,
        ),
      },
    };
  }, {});

  const mapped = await Promise.all(mappedCalls);

  return mapped.reduce((rgs, rg) => {
    rgs[rg.ResourceGroupLookup] = rg.ResourceGroup;

    return rgs;
  }, {} as Record<string, EaCCloudResourceGroupAsCode>);
}

async function loadCloudResourcesConnections(
  creds: ClientSecretCredential,
  azureResources: GenericResourceExpanded[],
  apiVersions: Record<string, string>,
  resourcesDef: Record<string, EaCCloudResourceAsCode>,
  resources: Record<string, EaCCloudResourceAsCode>,
  resLookups: string[],
): Promise<Record<string, EaCCloudResourceAsCode>> {
  const mappedCalls = resLookups!.map(async (resLookup) => {
    const resAzureResources = azureResources.filter(
      (ar) => ar.tags && ar.tags.ResourceLookup === resLookup,
    );

    const resKeys: Record<string, unknown> = {};

    const resLocations: Record<string, unknown> = {};

    for (const ar of resAzureResources) {
      try {
        const apiVersion = apiVersions[ar.type!] || "2023-01-01";

        const resLookupKey = `${ar.type}/${ar.name}`;

        resKeys[resLookupKey] = await loadResourceKeys(
          creds,
          apiVersion,
          ar.id!,
        );

        resLocations[resLookupKey] = ar.location!;
      } catch (err) {
        console.error(err);

        err.toString();
      }
    }

    const resDef = resourcesDef ? resourcesDef[resLookup] : {};

    let resResLookups = Object.keys(resDef?.Resources || {});

    const res = resources![resLookup];

    if (resResLookups.length === 0) {
      resResLookups = Object.keys(res.Resources || {});
    }

    return {
      ResourceLookup: resLookup,
      Resource: {
        Keys: resKeys,
        Locations: resLocations,
        Resources: await loadCloudResourcesConnections(
          creds,
          azureResources,
          apiVersions,
          resDef?.Resources || {},
          res.Resources || {},
          resResLookups,
        ),
      },
    };
  }, {});

  const mapped = await Promise.all(mappedCalls);

  return mapped.reduce((rss, rs) => {
    rss[rs.ResourceLookup] = rs.Resource;

    return rss;
  }, {} as Record<string, EaCCloudResourceAsCode>);
}

async function loadResourceKeys(
  creds: ClientSecretCredential,
  apiVersion: string,
  resId: string,
) {
  const token = await creds.getToken([
    "https://management.azure.com//.default",
  ]);

  const keyPaths = [
    `https://management.azure.com${resId}/listKeys?api-version=${apiVersion}`,
    `https://management.azure.com${resId}/listConnectionStrings?api-version=${apiVersion}`,
    `https://management.azure.com${resId}/listQueryKeys?api-version=${apiVersion}`,
  ];

  const response = await fetch(keyPaths[0], {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  });

  const keys = await response.json();

  let localKeys: Record<string, unknown> = {};

  if (!keys.error) {
    if (Array.isArray(keys)) {
      keys.forEach((key) => (localKeys[key.keyName] = key.value));
    } else if (keys.value && Array.isArray(keys.value)) {
      (keys.value as Record<string, any>[]).forEach((
        key,
      ) => (localKeys[key.keyName] = key.value || key.primaryKey));
    } else {
      localKeys = keys;
    }
  }

  return localKeys;
}
