import { getDataSourceSrv } from '@grafana/runtime';
import { Cognite3DViewer } from '@cognite/reveal';
import _ from 'lodash';

const mapModelToDropdown = (list) => _.map(list, ({ id, name }) => ({ label: name, value: id, id }));

const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';

const getDatasource = (uid) => _.find(_.get(getDataSourceSrv(), 'datasources'), { uid });

const startView = async (client, modelId, domElement) => {
  const revisoins = await client.revisions3D.list(modelId);
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).head().value();
  const viewer = new Cognite3DViewer({ domElement, sdk: client });

  const model = await viewer.addModel({
    modelId,
    revisionId: id,
  });
  viewer.loadCameraFromModel(model);
};

export { getAuth, getDatasource, startView, mapModelToDropdown };
