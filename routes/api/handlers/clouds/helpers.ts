import { Handlebars } from "@handlebars";
import {
  AzureDeploymentManager,
  AzureDeploymentManagerModels,
} from "npm:@azure/arm-deploymentmanager";
import {
  Deployment,
  DeploymentExtended,
  DeploymentsCreateOrUpdateResponse,
  ResourceManagementClient,
} from "npm:@azure/arm-resources";
import { OperationState, SimplePollerLike } from "npm:@azure/core-lro";
import { EaCCloudAsCode } from "../../../../src/eac/modules/clouds/EaCCloudAsCode.ts";
import { EaCCloudDeployment } from "../../../../src/api/models/EaCCloudDeployment.ts";
import { EaCCloudResourceGroupAsCode } from "../../../../src/eac/modules/clouds/EaCCloudResourceGroupAsCode.ts";
import { EaCCloudResourceAsCode } from "../../../../src/eac/modules/clouds/EaCCloudResourceAsCode.ts";
import { EaCCloudResourceFormatDetails } from "../../../../src/eac/modules/clouds/EaCCloudResourceFormatDetails.ts";
import { EaCCloudAzureDetails } from "../../../../src/eac/modules/clouds/EaCCloudAzureDetails.ts";
import { loadAzureCloudCredentials } from "../../../../src/utils/eac/loadAzureCloudCredentials.ts";
import { EaCHandlerCheckRequest } from "../../../../src/api/models/EaCHandlerCheckRequest.ts";

export async function buildCloudDeployments(
  cloudLookup: string,
  cloud: EaCCloudAsCode,
): Promise<EaCCloudDeployment[]> {
  const resGroupLookups = Object.keys(cloud.ResourceGroups || {});

  const deployments: EaCCloudDeployment[] = [];

  for (const resGroupLookup in resGroupLookups) {
    const resGroup = cloud.ResourceGroups![resGroupLookup];

    const deployment = await buildCloudDeployment(
      cloudLookup,
      resGroupLookup,
      resGroup,
    );

    deployments.push(deployment);
  }

  return deployments;
}

export async function buildCloudDeployment(
  cloudLookup: string,
  resGroupLookup: string,
  resGroup: EaCCloudResourceGroupAsCode,
): Promise<EaCCloudDeployment> {
  const resGroupTemplateResources: Record<string, unknown>[] = [];

  const armResources = await buildArmResourcesForResourceGroupDeployment(
    cloudLookup,
    resGroupLookup,
    resGroup,
  );

  resGroupTemplateResources.push(...armResources);

  const deploymentName = `resource-group-${resGroupLookup}-${Date.now()}`;

  const deployment: Deployment = {
    location: resGroup.Details!.Location,
    properties: {
      mode: "Incremental",
      expressionEvaluationOptions: {
        scope: "outer",
      },
      template: {
        type: "Microsoft.Resources/deployments",
        apiVersion: "2019-10-01",
        name: deploymentName,
        resources: resGroupTemplateResources,
        tags: {
          Cloud: cloudLookup,
        },
      },
    },
  };

  return {
    CloudLookup: cloudLookup,
    Deployment: deployment,
    Name: deploymentName,
    ResourceGroupLookup: resGroupLookup,
  };
}

export async function buildArmResourcesForResourceGroupDeployment(
  cloudLookup: string,
  resGroupLookup: string,
  resGroup: EaCCloudResourceGroupAsCode,
): Promise<Record<string, unknown>[]> {
  const armResources: Record<string, unknown>[] = [
    {
      type: "Microsoft.Resources/resourceGroups",
      apiVersion: "2018-05-01",
      name: resGroupLookup,
      location: resGroup.Details!.Location,
      properties: {},
      tags: {
        Cloud: cloudLookup,
      },
    },
  ];

  const resourceArmResources = await buildArmResourcesForResources(
    cloudLookup,
    resGroupLookup,
    resGroup.Resources || {},
    [`[resourceId('Microsoft.Resources/resourceGroups', ${resGroupLookup})]`],
  );

  armResources.push(...resourceArmResources);

  return armResources;
}

export async function buildArmResourcesForResources(
  cloudLookup: string,
  resGroupLookup: string,
  resources: { [key: string]: EaCCloudResourceAsCode },
  dependsOn: string[],
): Promise<Record<string, unknown>[]> {
  const resLookups = Object.keys(resources);

  const armResources: Record<string, unknown>[] = [];

  for (const resLookup of resLookups) {
    const resource = resources[resLookup];

    const resArmResources = await buildResourceTemplateResource(
      cloudLookup,
      resGroupLookup,
      resLookup,
      resource,
      dependsOn,
    );

    armResources.push(...resArmResources);
  }

  return armResources;
}

export async function buildResourceTemplateResource(
  cloudLookup: string,
  resGroupLookup: string,
  resLookup: string,
  resource: EaCCloudResourceAsCode,
  dependsOn: string[],
): Promise<Record<string, unknown>[]> {
  const details = resource.Details as EaCCloudResourceFormatDetails;

  const assets = await loadCloudResourceDetailAssets(details);

  const armResources: Record<string, unknown>[] = [
    {
      type: "Microsoft.Resources/deployments",
      apiVersion: "2019-10-01",
      dependsOn: dependsOn,
      resourceGroup: resGroupLookup,
      name: `resource-${resLookup}-${Date.now()}`,
      properties: {
        mode: "Incremental",
        expressionEvaluationOptions: {
          scope: "outer",
        },
        parameters: await formatParameters(
          details.Data || {},
          assets.Parameters,
        ),
        template: assets.Content,
      },
      tags: {
        Cloud: cloudLookup,
      },
    },
  ];

  const subResArmResources = await buildArmResourcesForResources(
    cloudLookup,
    resGroupLookup,
    resource.Resources || {},
    [`[resourceId('Microsoft.Resources/resourceGroups', ${resGroupLookup})]`],
  );

  armResources.push(...subResArmResources);

  return armResources;
}

export async function loadCloudResourceDetailAssets(
  details: EaCCloudResourceFormatDetails,
): Promise<{
  Content: Record<string, unknown>;
  Parameters: Record<string, unknown>;
}> {
  const assetPaths = [
    { Lookup: "Content", Path: details.Template.Content },
    { Lookup: "Parameters", Path: details.Template.Parameters },
  ];

  const assetCalls = assetPaths.map(async (asset) => {
    const result = await fetch(asset.Path);

    return {
      Lookup: asset.Lookup,
      Value: (await result.json()) as Record<string, unknown>,
    };
  });

  const assets = (await Promise.all(assetCalls)).reduce((prev, cur) => {
    return {
      ...prev,
      [cur.Lookup]: cur.Value,
    };
  }, {}) as {
    Content: Record<string, unknown>;
    Parameters: Record<string, unknown>;
  };

  return assets;
}

export async function beginEaCDeployments(
  cloud: EaCCloudAsCode,
  deployments: EaCCloudDeployment[],
): Promise<EaCHandlerCheckRequest[]> {
  const details = cloud.Details as EaCCloudAzureDetails;

  const resClient = new ResourceManagementClient(
    loadAzureCloudCredentials(cloud),
    details.SubscriptionID,
  );

  const beginDeploymentCalls = deployments.map(async (deployment) => {
    const beginDeploy = await resClient.deployments.beginCreateOrUpdate(
      deployment.ResourceGroupLookup,
      deployment.Name,
      deployment.Deployment,
    );

    return {
      ...deployment,
      Operation: await beginDeploy.getOperationState(),
    } as EaCHandlerCloudCheckRequest;
  });

  const checks = await Promise.all(beginDeploymentCalls);

  return checks;
}

export type EaCHandlerCloudCheckRequest =
  & {
    Operation: OperationState<DeploymentExtended>;
  }
  & EaCCloudDeployment
  & EaCHandlerCheckRequest;

export async function formatParameters(
  parameters: Record<string, unknown>,
  paramsTemplate: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const params = JSON.stringify(paramsTemplate);

  const handle = new Handlebars();

  const result = await handle.renderView(params, parameters);

  return JSON.parse(result) as Record<string, unknown>;
}

export async function loadDeployment(
  cloud: EaCCloudAsCode,
  resGroupLookup: string,
  deploymentName: string,
): Promise<DeploymentExtended> {
  const details = cloud.Details as EaCCloudAzureDetails;

  const creds = loadAzureCloudCredentials(cloud);

  const azDepClient = new AzureDeploymentManager(creds, details.SubscriptionID);

  const res = await azDepClient.operations.list();

  const resClient = new ResourceManagementClient(creds, details.SubscriptionID);

  const deployment = await resClient.deployments.get(
    resGroupLookup,
    deploymentName,
  );

  return deployment;
}
