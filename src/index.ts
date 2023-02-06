import * as core from "@actions/core";
import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { AzureCliCredential } from "@azure/identity";
import { getResourceIdsByDeployment } from "./data/deployment";
import { onboard } from "./data/onboard";
import { getPolicyStates } from "./data/policyStates";
import { createOrUpdateReport, getReport } from "./data/report";
import { getCredToken, getResourceSubscription, waitOnboardFinish } from "./utils/common";

async function start() {
  try {
    const tenantId = core.getInput('tenant-id');
    const deploymentId = core.getInput('deployment-id');
    const reportName = core.getInput('report-name');

    if (!deploymentId && !reportName) {
      throw new Error("Please configure deployment id or report name");
    }

    const cred = new AzureCliCredential();
    const token = await getCredToken(cred);
    const acatClient = new AppComplianceAutomationToolForMicrosoft365(cred);

    let resourceIds: string[] = [];

    if (deploymentId) {
      resourceIds = await getResourceIdsByDeployment(cred, deploymentId);
    } else {
      const report = await getReport(acatClient, token, reportName)
      resourceIds = report.properties.resources.map(meta => meta.resourceId);
    }

    const subscriptionIds = resourceIds.map(id => getResourceSubscription(id));

    await onboard(token, tenantId, subscriptionIds);
    core.info(`Successfully onboarded subscriptions`);
    await waitOnboardFinish();

    if (reportName) {
      await createOrUpdateReport(acatClient, token, reportName, resourceIds);
      core.info(`Successfully created or updated report ${reportName}`);
    }

    core.info("Evaluating policy states for all subscriptions...");
    await getPolicyStates(cred, resourceIds);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
