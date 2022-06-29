import { CogniteClient } from '@cognite/sdk';
import _ from 'lodash';

const appId = 'grafana3DModel';
export const getProjcets = (baseUrl) => {
  const client = new CogniteClient({
    project: '',
    appId,
    baseUrl,
    getToken: () => Promise.resolve(''),
    apiKeyMode: true,
  });
  return client.get('/api/v1/token/inspect');
};

export const cogniteClient = (project, baseUrl) => {
  return new CogniteClient({
    project,
    appId,
    baseUrl,
    getToken: () => Promise.resolve(''),
    apiKeyMode: true,
  });
};
