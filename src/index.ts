import * as core from "@actions/core";
import { AppComplianceAutomationToolForMicrosoft365 } from "@azure/arm-appcomplianceautomation";
import { AzureCliCredential } from "@azure/identity";
import { getResourceIdsByDeployment, getResourceIdsByDeployments } from "./data/deployment";
import { onboard } from "./data/onboard";
import { createOrUpdateReport, getReport } from "./data/report";
import { triggerEvaluation } from "./data/triggerEvaluation";
import { getCredToken, getResourceSubscription, waitOnboardFinish } from "./utils/common";
import { printAssessments } from "./utils/output";

async function start() {
  try {
    const deploymentIds = core.getInput('deployment-ids');
    const reportName = core.getInput('report-name');

    if ((!deploymentIds || deploymentIds.length === 0) && !reportName) {
      throw new Error("Please configure deployment id or report name");
    }

    const cred = new AzureCliCredential();
    const token = await getCredToken(cred);
    const acatClient = new AppComplianceAutomationToolForMicrosoft365(cred);

    let resourceIds: string[] = [];
    if (deploymentIds) {
      resourceIds = await getResourceIdsByDeployments(cred, JSON.parse(deploymentIds));
      core.info(JSON.stringify(resourceIds));
    } else {
      const report = await getReport(acatClient, token, reportName)
      resourceIds = report.properties.resources.map(meta => meta.resourceId);
    }

    const subscriptionIds = resourceIds.map(id => getResourceSubscription(id));

    await onboard(token, subscriptionIds);
    await waitOnboardFinish();
    core.info(`Successfully onboarded subscriptions`);

    if (reportName) {
      await createOrUpdateReport(acatClient, token, reportName, resourceIds);
      core.info(`Successfully created or updated report ${reportName}`);
    }

    core.info("Generating quick assessments for all resources...");
    const results = await triggerEvaluation(token, resourceIds);
    printAssessments(results);

  } catch (error) {
    core.setFailed(error.message);
  }
}

start();
