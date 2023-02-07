import { ResourceStatus } from "../constants/enum";

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
  };
  properties?: TriggerEvaluationResults | undefined;
}

export interface TriggerEvaluationResults {
  triggerTime: string;
  evaluationEndTime: string;
  resourceIds: string[];
  quickAssessments: QuickAssessments[];
}

export interface QuickAssessments {
  resourceId: string;
  responsibilityId: string;
  timestamp: string;
  resourceStatus: ResourceStatus;
  displayName: string;
  description: string;
  remediationLink: string;
}
