import _ from 'lodash';
import { Cognite3DViewer } from '@cognite/reveal';

const mapModelToDropdown = (list) => _.map(list, ({ id, name }) => ({ label: name, value: id, id }));

const map3DAssetMappingsToAssetCall = (list) =>
  _.unionBy(
    _.map(list, ({ assetId }) => ({ id: assetId })),
    'id'
  );
export const get3DModelList = async (client) => {
  const D3Models = await client.models3D.list({ published: true });
  return mapModelToDropdown(D3Models.items);
};
export const getAssetMappings3D = async (client, { revisionId, modelId }) => {
  const mappings3D = await client.assetMappings3D.list(_.toNumber(modelId), revisionId);
  const assets = await client.assets.retrieve(map3DAssetMappingsToAssetCall(mappings3D.items));
  return [{ label: '', value: null }, ...mapModelToDropdown(assets)];
};
export const getRevisionId = async (client, modelId) => {
  const revisoins = await client.revisions3D.list(_.toNumber(modelId));
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).last().value();
  return id;
};
export const getDisplay = async (client, modelId, domElement) => {
  const revisoins = await client.revisions3D.list(modelId);
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).head().value();
  const viewer = new Cognite3DViewer({ domElement, sdk: client });
  const model = await viewer.addModel({
    modelId,
    revisionId: id,
  });
  return { viewer, id, model };
};
