import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { BackendSrv, getBackendSrv } from '@grafana/runtime';
import { CogniteClient } from '@cognite/sdk';
import { Cognite3DViewer } from '@cognite/reveal';
import _ from 'lodash';
import { D3ModelOptions } from './types';
import { D3ModelNodesApiClient } from './providers/D3ModelNodesApiClient';
import { D3ModelDataProvider } from './providers/D3ModelDataProvider';
import { D3ModelMetaDataProvider } from './providers/D3ModelMetaDataProvider';

type Props = PanelProps<D3ModelOptions>;

const loginManager = {
  getToken: () => {
    return Promise.resolve('');
  },
};

const customDataSource = {
  getNodesApiClient: () => new D3ModelNodesApiClient(),
  getModelMetadataProvider: () => new D3ModelMetaDataProvider(),
  getModelDataProvider: () => new D3ModelDataProvider(),
};
const domElement = document.getElementById('canvas-wrapper');
const start = async (modelId, revisionId, client) => {
  const viewer = new Cognite3DViewer({ domElement, sdk: client });
  const model = await viewer.addModel({
    modelId,
    revisionId,
  });
  viewer.loadCameraFromModel(model);
};

export const D3ModelPanel: React.FC<Props> = (props) => {
  // const { options, data, width, height } = props;
  const { data } = props;
  const { series } = data;
  const flatter = _.chain(series).map('source').flatMapDeep();
  useEffect(() => {
    const projects = flatter.filter('project').value();
    if (projects.length) {
      const goodIds = flatter
        .filter({ status: 'Done' })
        .map(({ revisionId, modelId }) => ({ revisionId, modelId }))
        .value();
      const { project, url } = _.last(projects);
      const { revisionId, modelId } = _.last(goodIds);
      const client = new CogniteClient({
        project,
        appId: 'FileExtractor',
        baseUrl: `${url}/cdf-cc-oauth`,
        getToken: loginManager.getToken,
        apiKeyMode: true,
      });
      start(modelId, revisionId, client);
    }
  }, [series]);
  return (
    <div>
      <div className="canvas-wrapper" />
    </div>
  );
};
