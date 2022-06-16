import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { cogniteClient } from './client';
import { D3ModelOptions } from './types';
import { startView, fitCameraToAssetId } from './utils';

type Props = PanelProps<D3ModelOptions>;
/* const Display = ({ children, style }) => {
  console.log(children);
  return (
    <div style={style} ref={ref}>
      Select a 3D Model
    </div>
  );
}; */
export const D3ModelPanel: React.FC<Props> = ({ options, width, height, data, ...rest }) => {
  const ref = useRef();
  const { selected3DModel, withAssetSupport, zoomToAssetId } = options;
  // @ts-ignore
  useEffect(async () => {
    const client = cogniteClient(data.series);
    if (selected3DModel) {
      // @ts-ignore
      ref.current.innerHTML = null;
      const { viewer } = await startView(client, ref.current);
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
  }, [data, selected3DModel, zoomToAssetId, withAssetSupport]);
  return (
    <div style={{ width, height }} ref={ref}>
      Select a 3D Model
    </div>
  );
};
