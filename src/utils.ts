import { AssetNodeCollection, Cognite3DViewer, THREE } from '@cognite/reveal';
import { DataSourceSrv, getDataSourceSrv } from '@grafana/runtime';
import _ from 'lodash';

const { appUrl } = window.grafanaBootData.settings;
const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';

export const getAllProjectSettings = ({ defaultName, datasources }) => {
  const settings = _.filter(datasources, ({ id }) => id > 0);
  if (settings.length) {
    const datasource = _.find(settings, { name: defaultName });
    return {
      options: mapDatasourceToDropdown(settings),
      datasource: mapDasaourceToSelected(datasource ?? settings[0]),
    };
  }
  return {};
};
export const startView = (client, domElement) => {
  const viewer = new Cognite3DViewer({ domElement, sdk: client });
  return { viewer };
};
export async function fitCameraToAssetId(assetId: number, model, viewer: Cognite3DViewer, client) {
  const assetNodeCollection = new AssetNodeCollection(client, model);
  await assetNodeCollection.executeFilter({ assetId });
  const combinedBoundingBox = new THREE.Box3();
  const boundingBoxes = assetNodeCollection.getAreas().areas();

  // eslint-disable-next-line no-restricted-syntax
  for (const boundingBox of boundingBoxes) {
    combinedBoundingBox.union(boundingBox);
  }

  const transformedBox = model.mapBoxFromCdfToModelCoordinates(combinedBoundingBox);
  viewer.fitCameraToBoundingBox(transformedBox);
}

export const mapModelToDropdown = (list) => _.map(list, ({ id, name }) => ({ label: name, value: id, id }));
export const map3DAssetMappingsToAssetCall = (list) =>
  _.unionBy(
    _.map(list, ({ assetId }) => ({ id: assetId })),
    'id'
  );
export const mapDasaourceToSelected = ({
  name,
  project,
  url,
  connector: { oauthClientCredentials, oauthPassThru },
}) => ({
  id: project,
  label: name,
  baseUrl: `${appUrl.slice(0, appUrl.length - 1)}${url}/${getAuth(oauthClientCredentials, oauthPassThru)}`,
});
export const mapDatasourceToDropdown = (list) => _.map(list, mapDasaourceToSelected);
export const mapProjectsToDropdown = (list) =>
  _.map(list, ({ projectUrlName }) => ({ id: projectUrlName, label: projectUrlName }));
