import axios from "axios";
import { Endpoints } from "../constants/endpoints";
import { AsyncStatus } from "../constants/enum";
import { isResponseOk, pollUntilDone } from "../utils/network";

export async function onboard(
  token: string,
  tenantId: string,
  subscriptionIds: string[]
) {
  const response = await axios.post(Endpoints.onboard, {
    subscriptionIds
  }, {
    headers: {
      "Authorization": token,
      "Content-Type": "application/json",
      "x-ms-client-tenant-id": tenantId,
      "x-ms-aad-user-token": token
    }
  });

  if (!isResponseOk(response.status)) {
    throw new Error(`onboard subscriptions request failed`);
  }

  const operationUrl = response.headers["azure-asyncoperation"];
  const operationRes = await pollUntilDone(token, operationUrl);

  if (operationRes.status !== AsyncStatus.SUCCEEDED) {
    throw new Error(`onboard failed, code: ${operationRes.error?.code}, message: ${operationRes.error?.message}`);
  }
}
