import React, { useEffect } from 'react';
import { Cognite3DViewer } from '@cognite/reveal';
import { CogniteClient } from '@cognite/sdk';

const D3Viewer = (props) => {
  const { modelId, revisionId, project, url, style } = props;
  const domElement = document.getElementById('canvas-wrapper');
  // @ts-ignore
  const sdk = new CogniteClient({
    appId: 'grafana3DAppId',
    project,
    baseUrl: `http://localhost:3000${url}/cdf-cc-oauth`,
    getToken: () => Promise.resolve(''),
  });
  // await client.authenticate();
  const viewer = new Cognite3DViewer({ domElement, sdk });
  const start = async () => {
    console.log('started');
    const model = await viewer.addModel({
      modelId,
      revisionId,
    });
    viewer.loadCameraFromModel(model);
  };
  useEffect(() => {
    start();
  }, []);
  return (
    <div>
      <div className="canvas-wrapper" id="canvas-wrapper" style={style} />
    </div>
  );
};

export default D3Viewer;
