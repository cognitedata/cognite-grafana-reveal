import _ from 'lodash';
import { map3DAssetMappingsToAssetCall, mapModelToDropdown } from '../utils';

export const get3DModelList = async (client) => {
  const D3Models = await client.models3D.list({ published: true });
  return mapModelToDropdown(D3Models.items);
};
export const getAssetMappings3D = async (client, { revisionId, modelId }) => {
  const mappings3D = await client.assetMappings3D.list(_.toNumber(modelId), revisionId);
  const assets = await client.assets.retrieve(map3DAssetMappingsToAssetCall(mappings3D.items));
  return mapModelToDropdown(assets);
};
export const getRevisionId = async (client, modelId) => {
  const revisoins = await client.revisions3D.list(_.toNumber(modelId));
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).last().value();
  return id;
};
