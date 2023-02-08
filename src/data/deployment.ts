import { ResourceManagementClient, ResourceReference } from "@azure/arm-resources";
import { AzureCliCredential } from "@azure/identity";
import { all } from "axios";
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

  const promises= deploymentIds.map(async id => await getResourceIdsByDeployment(cred, id));
  const allResources = await Promise.all(promises);
  return [... new Set(allResources.flat())];
}
