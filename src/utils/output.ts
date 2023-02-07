import { ResourceStatus } from "../constants/enum";
import { TriggerEvaluationResults } from "../models/operation";

export function printAssessments(results: TriggerEvaluationResults | undefined) {
  if (!results) {
    return;
  }

  for (const assessment of results.quickAssessments) {
    const msg = `Resource Id: ${assessment.resourceId}\tName: ${assessment.displayName}\tDescription: ${assessment.description}\tResponsibility Id: ${assessment.responsibilityId}\t`;
    if (assessment.resourceStatus === ResourceStatus.HEALTHY) {
      console.log('\x1b[32m%s\x1b[0m', msg + "Compliant");
    } else {
      console.log('\x1b[31m%s\x1b[0m', msg + "Non-compliant");
    }
  }
}
