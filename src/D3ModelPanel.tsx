import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { CogniteClient } from '@cognite/sdk';
import { Cognite3DViewer } from '@cognite/reveal';
import _ from 'lodash';
import { D3ModelOptions } from './types';

type Props = PanelProps<D3ModelOptions>;

const loginManager = {
  getToken: () => {
    return Promise.resolve('grafan');
  },
};

export const D3ModelPanel: React.FC<Props> = (props) => {
  // const { options, data, width, height } = props;
  const { data } = props;
  const { series } = data;
  const flatter = _.chain(series).map('source').flatMapDeep();

  const domElement = document.getElementById('canvas-wrapper');
  const start = async (modelId, revisionId, client) => {
    const t = await client.authenticate();
    // console.log(t);
    const viewer = new Cognite3DViewer({ domElement, sdk: client });
    /* const model = await viewer.addModel({
      modelId,
      revisionId,
    });
    viewer.loadCameraFromModel(model); */
  };
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
        appId: 'grafan',
        baseUrl: `http://localhost:3000${url}/cdf-cc-oauth`,
        getToken: loginManager.getToken,
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
