const armEndpoint = "https://eastus2euap.management.azure.com";
const RP_NAMESPACE = "Microsoft.AppComplianceAutomation";
const version = "2023-02-15-preview";

export const Endpoints = {
  onboard: `${armEndpoint}/providers/${RP_NAMESPACE}/onboard?api-version=${version}`,
  triggerEvaluation: `${armEndpoint}/providers/${RP_NAMESPACE}/triggerEvaluation?api-version=${version}`
};
