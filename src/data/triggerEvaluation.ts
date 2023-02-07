import axios from "axios";
import { Endpoints } from "../constants/endpoints";
import { AsyncStatus } from "../constants/enum";
import { TriggerEvaluationResults } from "../models/operation";
import { isResponseOk, pollUntilDone } from "../utils/network";

export async function triggerEvaluation(
  token: string,
  tenantId: string,
  resourceIds: string[]
): Promise<TriggerEvaluationResults | undefined> {
  const response = await axios.post(Endpoints.triggerEvaluation, {
    resourceIds
  }, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
      "x-ms-client-tenant-id": tenantId,
      "x-ms-aad-user-token": token
    }
  });

  if (!isResponseOk(response.status)) {
    throw new Error(`trigger evaluation request failed`);
  }

  const operationUrl = response.headers["azure-asyncoperation"];
  const operationRes = await pollUntilDone(token, operationUrl);

  if (operationRes.status !== AsyncStatus.SUCCEEDED) {
    throw new Error(`trigger evaluation failed, code: ${operationRes.error?.code}, message: ${operationRes.error?.message}`);
  }

  return operationRes.properties;
}
