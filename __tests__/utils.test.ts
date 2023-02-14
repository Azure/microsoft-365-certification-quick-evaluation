import { getDeploymentMeta, tryParseJsonArray } from "../src/utils/common";

describe('get deployment meta', () => {

  const SUBSCRIPTION_ID = 'subscriptionId';
  const RESOURCE_GROUP = 'resourceGroup';
  const DEPLOYMENT_NAME = 'deploymentName'
  const DEPLOYMENT_ID = `/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Resources/deployments/${DEPLOYMENT_NAME}`;

  it('parse deployment id successfully', () => {

    const meta = getDeploymentMeta(DEPLOYMENT_ID);

    expect(meta.get('subscriptions')).toBe(SUBSCRIPTION_ID);
    expect(meta.get('resourceGroups')).toBe(RESOURCE_GROUP);
    expect(meta.get('deployments')).toBe(DEPLOYMENT_NAME);
  });
});

describe('parse json array input', () => {

  const INVALID_JSON = '{';
  const NON_ARRAY_JSON = '{"key": "value"}';
  const EMPTY_ARRAY = '[]';
  const NON_STRING_ARRAY = '[1, 2]';
  const VALID_ARRAY_STR = '["test"]';

  it('invalid JSON', () => {
    expect(() => tryParseJsonArray(INVALID_JSON))
      .toThrow(/^Invalid json string in deployment ids/);
  });

  it('non-array input', () => {
    expect(() => tryParseJsonArray(NON_ARRAY_JSON))
      .toThrow('Deployment ids should be an array');
  });

  it('empty array', () => {
    expect(() => tryParseJsonArray(EMPTY_ARRAY))
      .toThrow('Deployment ids should not be empty');
  });

  it('non-string array', () => {
    expect(() => tryParseJsonArray(NON_STRING_ARRAY))
      .toThrow('Deployment ids should be an array of string');
  });

  it('non-string array', () => {
    expect(tryParseJsonArray(VALID_ARRAY_STR)).toHaveLength(1);
  });
});
