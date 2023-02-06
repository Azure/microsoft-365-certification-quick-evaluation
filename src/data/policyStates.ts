import * as core from "@actions/core";
import { PolicyInsightsClient } from "@azure/arm-policyinsights";
import { AzureCliCredential } from "@azure/identity";
import { isRealTimePolicy } from "../utils/common";

export async function getPolicyStates(cred: AzureCliCredential, resourceIds: string[]) {
  const subscriptionSet = new Set<string>();

  for (const id of resourceIds) {
    const strs = id.split("/");
    if (strs.length < 3) {
      continue;
    }
    subscriptionSet.add(strs[2]);
  }

  const clients: PolicyInsightsClient[] = Array.from(subscriptionSet).map(id => new PolicyInsightsClient(cred, id));
  const triggerPromises: Promise<void>[] = [];

  for (const client of clients) {
    const promise = client.policyStates.beginTriggerSubscriptionEvaluationAndWait(client.subscriptionId);
    triggerPromises.push(promise);
  }

  await Promise.all(triggerPromises);

  core.info("Generating results...");
  const lowerCaseResourceIds = resourceIds.map(id => id.toLocaleLowerCase());
  for (const client of clients) {
    const iter = client.policyStates.listQueryResultsForSubscription("default", client.subscriptionId);

    for await (let policyState of iter) {
      const resourceId = policyState.resourceId ?? "";
      if (
        isRealTimePolicy(policyState.policyDefinitionId ?? "") &&
        lowerCaseResourceIds.includes(resourceId.toLocaleLowerCase())
      ) {
        if (policyState.isCompliant) {
          core.info(`Resource Id: ${resourceId}\tDefinition Id: ${policyState.policyDefinitionId}\tIs Compliant: ${policyState.isCompliant}`);
        } else {
          core.error(`Resource Id: ${resourceId}\tDefinition Id: ${policyState.policyDefinitionId}\tIs Compliant: ${policyState.isCompliant}`);
        }
      }
    }
  }
}
