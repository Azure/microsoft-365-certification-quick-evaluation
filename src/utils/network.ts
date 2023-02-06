import axios from "axios";
import { AsyncStatus } from "../constants/enum";
import { GetOperationResponse } from "../models/operation";

export function isResponseOk(status: number): boolean {
  return status >= 200 && status <= 299;
}

const RETRY_AFTER = 2000;
const MAX_RETRY = 30;

export async function pollUntilDone(token: string, operationUrl: string) {

  let retryCnt = 0;

  const poll = async (resolve: (value: GetOperationResponse) => void, reject: (reason: any) => void) => {

    const res = await axios.get(operationUrl, {
      headers: {
        "Authorization": token
      }
    });

    retryCnt++;

    const response = res.data as GetOperationResponse;
    if (response.status === AsyncStatus.SUCCEEDED || response.status === AsyncStatus.FAILED || response.status === AsyncStatus.CANCELED) {
      return resolve(response);
    } else if (retryCnt === MAX_RETRY) {
      return reject(response);
    } else {
      setTimeout(poll, RETRY_AFTER, resolve, reject);
    }
  }
  return new Promise(poll);
}
