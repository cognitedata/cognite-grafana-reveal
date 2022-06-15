import { getDataSourceSrv } from '@grafana/runtime';
import { AssetNodeCollection, Cognite3DModel, Cognite3DViewer, THREE } from '@cognite/reveal';
import { HtmlOverlayTool } from '@cognite/reveal/tools';
import _ from 'lodash';

const mapModelToDropdown = (list) => _.map(list, ({ id, name }) => ({ label: name, value: id, id }));

const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';

const getDatasource = (uid) => _.find(_.get(getDataSourceSrv(), 'datasources'), { uid });

const startView = async (client, modelId, domElement, zoomToAssetId) => {
  const revisoins = await client.revisions3D.list(modelId);
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).head().value();
  const viewer = new Cognite3DViewer({ domElement, sdk: client });
  const overlays = new HtmlOverlayTool(viewer);
  const model = await viewer.addModel({
    modelId,
    revisionId: id,
  });
  viewer.loadCameraFromModel(model);
  viewer.on('click', async (event) => {
    // Find 3D coordinate of what the user clicks
    const intersection = await viewer.getIntersectionFromPixel(event.offsetX, event.offsetY);
    if (intersection) {
      const el = createOverlay();
      overlays.add(el, intersection.point);
      // Remove overlay after 5 seconds
      setTimeout(() => overlays.remove(el), 5000);
    }
  });
  if (zoomToAssetId) {
    fitCameraToAssetId(zoomToAssetId, model, viewer, client);
  }
  return id;
};
const map3DAssetMappingsToAssetCall = (list) =>
  _.unionBy(
    _.map(list, ({ assetId }) => ({ id: assetId })),
    'id'
  );
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

function createOverlay() {
  const element = document.createElement('div');
  element.innerText = `Overlay!`;
  element.style.cssText = `
    position: absolute;

    /* Anchor to the center of the element and ignore events */
    transform: translate(-50%, -50%);
    pointer-events: none;
    touch-action: none;
    user-select: none;

    /* Make it look nice */
    padding: 10px;
    minHeight: 50px;
    color: #fff;
    background: #232323da;
    borderRadius: 0.25em;
    border: '#ffffff22 solid 2px;
  `;
  return element;
}

export { getAuth, getDatasource, startView, mapModelToDropdown, map3DAssetMappingsToAssetCall, fitCameraToAssetId };
