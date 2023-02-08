import { ResourceManagementClient, ResourceReference } from "@azure/arm-resources";
import { AzureCliCredential } from "@azure/identity";
import { getDeploymentMeta } from "../utils/common";

export async function getResourceIdsByDeployment(
  cred: AzureCliCredential,
  deploymentId: string
): Promise<string[]> {

  const deploymentMeta = getDeploymentMeta(deploymentId);
  const subscriptionId = deploymentMeta.get("subscriptions") ?? "";
  const resourceGroup = deploymentMeta.get("resourceGroups") ?? "";
  const deploymentName = deploymentMeta.get("deployments") ?? "";

  const depclient = new ResourceManagementClient(cred, subscriptionId);
  const deployment = await depclient.deployments.get(resourceGroup, deploymentName);
  return deployment.properties?.outputResources?.map(
    (resource: ResourceReference) => {
      return resource.id ?? "null"
    }
  ) ?? [];
}

export async function getResourceIdsByDeployments(
  cred: AzureCliCredential,
  deploymentIds: string[]
): Promise<string[]> {

  let allResources: string[] = [];
  deploymentIds.map(async id => allResources = allResources.concat(await getResourceIdsByDeployment(cred, id)))
  return [... new Set(allResources)];
}
