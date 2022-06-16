import { CogniteClient } from '@cognite/sdk';
import { getDataSourceSrv } from '@grafana/runtime';
import _ from 'lodash';

const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';

const getDatasourceFromData = (data) => {
  const datasourceSrv = getDataSourceSrv();
  const source = _.get(_.last(data), 'source');
  if (source) {
    return _.find(_.get(datasourceSrv, 'datasources'), {
      project: _.get(_.head(source), 'name'),
    });
  }
  return {};
};

export const cogniteClient = (data) => {
  const { url, connector, project } = getDatasourceFromData(data);
  if (connector) {
    const { oauthClientCredentials, oauthPassThru } = connector;
    const { appUrl } = window.grafanaBootData.settings;
    const baseUrl = `${appUrl.slice(0, appUrl.length - 1)}${url}/${getAuth(oauthClientCredentials, oauthPassThru)}`;
    return new CogniteClient({
      project,
      appId: 'grafana3DModel',
      baseUrl,
      getToken: () => Promise.resolve(''),
      apiKeyMode: true,
    });
  }
  return null;
};
