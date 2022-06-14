import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Cognite3DViewer } from '@cognite/reveal';
import _ from 'lodash';
import cogniteClient from './client';
import { D3ModelOptions } from './types';

type Props = PanelProps<D3ModelOptions>;

const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';
const creatClient = (dataSourceSrv) => {
  let datasource = null;
  // @ts-ignore
  Object.keys(dataSourceSrv.datasources).forEach((key) => {
    // @ts-ignore
    if (dataSourceSrv.datasources[key].project) {
      // @ts-ignore
      datasource = dataSourceSrv.datasources[key];
    }
  });
  if (datasource) {
    return datasource;
  }
  return { connector: {} };
};

const start = async (modelId, revisionId, viewer) => {
  const model = await viewer.addModel({
    modelId,
    revisionId,
  });
  viewer.loadCameraFromModel(model);
};
const startView = async (client, modelId, domElement) => {
  const revisoins = await client.revisions3D.list(modelId);
  const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).head().value();
  const viewer = new Cognite3DViewer({ domElement, sdk: client });

  start(modelId, id, viewer);
};
export const D3ModelPanel: React.FC<Props> = (props) => {
  const { options, width, height } = props;
  const config = window.grafanaBootData.settings.appUrl;
  const dataSourceSrv = getDataSourceSrv();
  const datasource = creatClient(dataSourceSrv);
  const baseUrl = `${config.slice(0, config.length - 1)}${datasource.url}/${getAuth(
    datasource.connector.oauthClientCredentials,
    datasource.connector.oauthPassThru
  )}`;

  const domElement = document.getElementById('canvas-wrapper');
  const client = cogniteClient(datasource.project, baseUrl);
  const models3D = async () => {
    const models3D = await client.models3D.list({ published: true });
    options.d3models = models3D.items;
  };
  useEffect(() => {
    models3D();
  }, []);
  useEffect(() => {
    if (options.d3model) {
      domElement.innerHTML = null;
      startView(client, options.d3model, domElement);
    }
  }, [options.d3model]);
  return (
    <div>
      <div className="canvas-wrapper" id="canvas-wrapper" style={{ width, height }} />
    </div>
  );
};
