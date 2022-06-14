import { CogniteClient } from '@cognite/sdk';

const loginManager = {
  getToken: () => {
    return Promise.resolve('');
  },
};
export default (project, baseUrl) =>
  new CogniteClient({
    project,
    appId: 'grafana3DModel',
    baseUrl,
    getToken: loginManager.getToken,
    apiKeyMode: true,
  });
