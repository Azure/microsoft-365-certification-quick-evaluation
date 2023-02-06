import { AppComplianceAutomationToolForMicrosoft365, ReportResource } from "@azure/arm-appcomplianceautomation";

export async function createOrUpdateReport(
  client: AppComplianceAutomationToolForMicrosoft365,
  token: string,
  reportName: string,
  resourceIds: string[]
) {

  const resources = resourceIds.map((resourceId: string) => {
    return { resourceId: resourceId, tags: {} };
  });

  const params = {
    properties: {
      resources,
      timeZone: "China Standard Time",
      triggerTime: new Date("2022-12-05T18:00:00.000Z")
    }
  };

  const options = {
    requestOptions: {
      customHeaders: {
        "Authorization": token,
        "x-ms-aad-user-token": token,
        "Content-Type": "application/json"
      }
    }
  };

  const req = await client.report.beginCreateOrUpdate(reportName, params, options);
  await req.pollUntilDone();
}

export async function getReport(
  client: AppComplianceAutomationToolForMicrosoft365,
  token: string,
  reportName: string
): Promise<ReportResource> {

  const options = {
    requestOptions: {
      customHeaders: {
        "Authorization": token,
        "x-ms-aad-user-token": token,
        "Content-Type": "application/json"
      }
    }
  };

  return await client.report.get(reportName, options);
}
