import { AzureCliCredential } from "@azure/identity";
import { setTimeout } from "timers/promises";

export async function getCredToken(cred: AzureCliCredential): Promise<string> {
  const token = await cred.getToken("https://management.azure.com//.default");
  return `Bearer ${token.token}`;
}

export function getResourceSubscription(resourceId: string): string {
  const subStr = resourceId.split("/");
  return subStr.length >= 3 ? subStr[2] : "";
}

export function getDeploymentMeta(deploymentId: string): Map<string, string> {
  const tokens = deploymentId.split("/");
  const deploymentMeta = new Map<string, string>();
  for (let i = 1; i < tokens.length - 1; i = i + 2) {
    deploymentMeta.set(tokens[i], tokens[i + 1]);
  }
  return deploymentMeta;
}

export function tryParseJsonArray(jsonStr: string): string[] {
  let jsonObj;
  //make sure input is valid json
  try {
    jsonObj = JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(`Invalid json string in deployment ids "${jsonStr}", error message:${error.message}`);
  }

  if (!Array.isArray(jsonObj)) {
    throw new Error("Deployment ids should be an array");
  }
  if (jsonObj.length === 0) {
    throw new Error("Deployment ids should not be empty");
  }
  if (typeof jsonObj[0] !== "string") {
    throw new Error("Deployment ids should be an array of string");
  }
  return jsonObj;
}

export async function waitOnboardFinish() {
  // TODO: replace with check dependency successfully created
  // wait for 30 seconds temporarily
  await setTimeout(30 * 1000);
}
