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
  const b = baseUrl.split('/');
  return client.get(b[b.length - 1].match('cdf-api-key') ? '/login/status' : '/api/v1/token/inspect');
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
