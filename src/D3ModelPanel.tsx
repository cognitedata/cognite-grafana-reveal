import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SingleStatBaseOptions } from '@grafana/ui';
import { cogniteClient } from './client';
import { D3ModelOptions } from './types';
import { startView, fitCameraToAssetId } from './utils';

type Props = PanelProps<SingleStatBaseOptions & D3ModelOptions>;

export const D3ModelPanel: React.FC<Props> = ({
  options: { selectedDatasource, selectedProject, selected3DModel, zoomToAssetId },
  width,
  height,
}) => {
  const ref = useRef();
  const [viewer, setViewer] = useState(null);
  const [model, setModel] = useState(null);
  const client = useMemo(() => {
    return (
      selectedDatasource?.baseUrl &&
      selectedProject?.id &&
      cogniteClient(selectedProject.id, selectedDatasource?.baseUrl)
    );
  }, [selectedDatasource, selectedProject]);

  const display = async (client, viewer) => {
    const model = await viewer.addModel(selected3DModel);
    setModel(model);
    viewer.loadCameraFromModel(model);
    viewer.on('click', async (event) => {
      const intersection = await viewer.getIntersectionFromPixel(event.offsetX, event.offsetY);
      if (intersection) {
        console.log('intersection', intersection);
      }
    });
    if (zoomToAssetId) {
      fitCameraToAssetId(zoomToAssetId, model, viewer, client);
    }
  };
  useEffect(() => {
    if (selectedProject && client) {
      if (selected3DModel) {
        // @ts-ignore
        ref.current?.innerHTML = null;
        const { viewer } = startView(client, ref.current);
        setViewer(viewer);
        display(client, viewer);
      }
    }
  }, [selectedProject, selected3DModel, client]);
  useEffect(() => {
    if (zoomToAssetId && model) {
      fitCameraToAssetId(zoomToAssetId, model, viewer, client);
    }
  }, [zoomToAssetId]);
  return (
    <div style={{ width, height }} ref={ref}>
      Select a 3D Model
    </div>
  );
};
