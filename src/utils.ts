import { AssetNodeCollection, Cognite3DViewer, THREE } from '@cognite/reveal';
import _ from 'lodash';

const startView = async (client, domElement) => {
  const viewer = new Cognite3DViewer({ domElement, sdk: client });
  return { viewer };
};
async function fitCameraToAssetId(assetId: number, model, viewer: Cognite3DViewer, client) {
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

export { startView, fitCameraToAssetId };
