import { AzureCliCredential } from "@azure/identity";
import { getResourceIdsByDeployments } from "../src/data/deployment";

const DEPLOYMENT_IDS = ['deploymentId'];
const RESOURCE_ID = 'resourceId';

const deploymentResponse = {
  properties: {
    outputResources: [
      {
        id: RESOURCE_ID
      }
    ]
  }
};

jest.mock('@azure/identity');
jest.mock('@azure/arm-resources', () => {
  const originModule = jest.requireActual('@azure/arm-resources');
  return {
    __esModule: true,
    ...originModule,
    ResourceManagementClient:
      function ResourceManagementClient(_cred: AzureCliCredential, _subId: string) {
        return {
          deployments: {
            get: () => deploymentResponse
          }
        }
      }
  };
});

describe('get resource ids by deployment', () => {
  it('returns correct ids', async () => {
    const cred = new AzureCliCredential();
    const resourceId = await getResourceIdsByDeployments(cred, DEPLOYMENT_IDS);
    expect(resourceId).toStrictEqual([RESOURCE_ID]);
  });
});
