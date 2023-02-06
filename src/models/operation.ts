export interface GetOperationResponse {
  id: string;
  name: string;
  resourceId: string;
  status: string;
  startTime: string;
  endTime: string;
  error?: {
    code?: string | undefined;
    message?: string | undefined;
  }
}
