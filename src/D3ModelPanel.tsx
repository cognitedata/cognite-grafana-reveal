import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Cognite3DViewer } from '@cognite/reveal';
import _ from 'lodash';
import cogniteClient from './client';
import { D3ModelOptions } from './types';

type Props = PanelProps<D3ModelOptions>;

const dataSourceSrv = getDataSourceSrv();
const creatClient = () => {
  let datasource = null;
  let customDataSource = null;
  // @ts-ignore
  Object.keys(dataSourceSrv.datasources).forEach((key) => {
    // @ts-ignore
    if (dataSourceSrv.datasources[key].project) {
      // @ts-ignore
      datasource = dataSourceSrv.datasources[key];
    }
  });
  if (datasource) {
    // @ts-ignore
    customDataSource = datasource;
  }
  return customDataSource;
};

const getAuth = (oauthClientCredentials, oauthPassThru) =>
  // eslint-disable-next-line no-nested-ternary
  oauthClientCredentials ? 'cdf-cc-oauth' : oauthPassThru ? 'cdf-oauth' : 'cdf-api-key';

export const D3ModelPanel: React.FC<Props> = (props) => {
  const { options, width, height } = props;
  const config = window.grafanaBootData.settings.appUrl;
  const datasource = creatClient();
  // console.log(datasource.connector.oauthClientCredentials);
  const baseUrl = `${config.slice(0, config.length - 1)}${datasource.url}/${getAuth(
    datasource.connector.oauthClientCredentials,
    datasource.connector.oauthPassThru
  )}`;
  const client = cogniteClient(datasource.project, baseUrl);

  const models3D = async (client) => {
    const models3D = await client.models3D.list({ published: true });
    options.d3models = models3D.items;
  };
  const start = async (modelId, revisionId) => {
    const domElement = document.getElementById('canvas-wrapper');
    const viewer = new Cognite3DViewer({ domElement, sdk: client });
    const model = await viewer.addModel({
      modelId,
      revisionId,
    });
    viewer.loadCameraFromModel(model);
  };
  const startView = async (modelId) => {
    const revisoins = await client.revisions3D.list(modelId);
    const { id } = _.chain(revisoins.items).filter({ status: 'Done' }).head().value();
    start(modelId, id);
  };
  useEffect(() => {
    models3D(client);
  }, [client]);
  useEffect(() => {
    if (options.d3model) startView(options.d3model);
  }, [options.d3model]);
  return (
    <div>
      <div className="canvas-wrapper" id="canvas-wrapper" style={{ width, height }} />
    </div>
  );
};
