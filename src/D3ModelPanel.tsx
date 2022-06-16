import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { cogniteClient } from './client';
import { D3ModelOptions } from './types';
import { startView, fitCameraToAssetId } from './utils';

type Props = PanelProps<D3ModelOptions>;

export const D3ModelPanel: React.FC<Props> = ({ options, width, height, data }) => {
  const { selected3DModel, withAssetSupport, zoomToAssetId } = options;
  const domElement = document.getElementById('canvas-wrapper');
  // @ts-ignore
  useEffect(async () => {
    const client = cogniteClient(data.series);
    if (domElement) {
      if (selected3DModel) {
        domElement.innerHTML = null;
        const { viewer } = await startView(client, domElement);
        const model = await viewer.addModel(selected3DModel);
        viewer.loadCameraFromModel(model);
        viewer.on('click', async (event) => {
          const intersection = await viewer.getIntersectionFromPixel(event.offsetX, event.offsetY);
          if (intersection) {
            console.log(intersection);
          }
        });
        if (zoomToAssetId) {
          fitCameraToAssetId(zoomToAssetId, model, viewer, client);
        }
      }
    }
  }, [data, selected3DModel, zoomToAssetId, withAssetSupport, domElement]);
  return (
    <div>
      <div className="canvas-wrapper" id="canvas-wrapper" style={{ width, height }}>
        Select a model to visualize
      </div>
    </div>
  );
};
