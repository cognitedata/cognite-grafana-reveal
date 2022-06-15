import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import cogniteClient from './client';
import { D3ModelOptions } from './types';
import {
  getAuth,
  getDatasource,
  startView,
  mapModelToDropdown,
  fitCameraToAssetId,
  map3DAssetMappingsToAssetCall,
} from './utils';

type Props = PanelProps<D3ModelOptions>;

export const D3ModelPanel: React.FC<Props> = (props) => {
  const { options, width, height, data } = props;
  const { selected3DModel, withAssetSupport, zoomToAssetId } = options;
  const { uid } = data.request.targets[0].datasource;
  const config = window.grafanaBootData.settings.appUrl;
  const get3DModels = async (client) => {
    const D3Models = await client.models3D.list({ published: true });
    options.list3DModels = mapModelToDropdown(D3Models.items);
    return options;
  };
  const getAssets = async (client, revisionID) => {
    const mappings3D = await client.assetMappings3D.list(selected3DModel, revisionID);
    const assets = await client.assets.retrieve(map3DAssetMappingsToAssetCall(mappings3D.items));
    options.listAssets = mapModelToDropdown(assets);
    return options;
  };
  // @ts-ignore
  useEffect(async () => {
    const datasource = getDatasource(uid);
    const baseUrl = `${config.slice(0, config.length - 1)}${datasource.url}/${getAuth(
      datasource.connector.oauthClientCredentials,
      datasource.connector.oauthPassThru
    )}`;
    const client = cogniteClient(datasource.project, baseUrl);
    get3DModels(client);
    if (selected3DModel) {
      const domElement = document.getElementById('canvas-wrapper');
      domElement.innerHTML = null;
      const id = await startView(client, selected3DModel, domElement, zoomToAssetId);
      if (withAssetSupport) {
        getAssets(client, id);
      }
    }
  }, [data.request, selected3DModel, withAssetSupport, zoomToAssetId]);
  return (
    <div>
      <div className="canvas-wrapper" id="canvas-wrapper" style={{ width, height }} />
    </div>
  );
};

// const setOverlay = porps => {}
