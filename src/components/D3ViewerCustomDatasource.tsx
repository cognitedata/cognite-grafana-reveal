import React, { useEffect } from 'react';
import { Cognite3DViewer } from '@cognite/reveal';
import { DataSource } from '@cognite/reveal/packages/data-source';
import dataSource from './providers';

const D3ViewerCustomDatasource = (props) => {
  const { modelId, revisionId, project, url, style } = props;
  const domElement = document.getElementById('canvas-wrapper');
  // @ts-ignore
  const customDataSource: DataSource = dataSource();
  const start = async () => {
    console.log('started');
    // @ts-ignore
    const viewer = new Cognite3DViewer({ domElement, customDataSource });
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

export default D3ViewerCustomDatasource;
