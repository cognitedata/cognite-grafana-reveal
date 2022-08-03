import { PanelPlugin } from '@grafana/data';
import _ from 'lodash';
import { D3ModelOptions } from './types';
import { D3ModelPanel } from './D3ModelPanel';
import { AssetSelector, Select3DModelEditor, SelectProjectEditor, SelectDatasourceEditor } from './components';
import { cogniteClient, getProjcets } from './client';

export const plugin = new PanelPlugin<D3ModelOptions>(D3ModelPanel).setPanelOptions((builder) => {
  builder
    .addCustomEditor({
      id: 'datasources',
      path: 'selectedDatasource',
      name: 'Datasource Project name',
      editor: SelectDatasourceEditor,
    })
    .addCustomEditor({
      id: 'projects',
      path: 'selectedProject',
      name: 'Project',
      editor: SelectProjectEditor,
      settings: {
        getClient: (baseUrl) => getProjcets(baseUrl),
      },
    })
    .addCustomEditor({
      id: 'D3Model',
      path: 'selected3DModel',
      name: '3D Model',
      editor: Select3DModelEditor,
      settings: {
        getClient: (project, baseUrl) => cogniteClient(project, baseUrl),
      },
    })
    .addCustomEditor({
      id: 'ZoomToAssetId',
      path: 'zoomToAssetId',
      name: 'Zoom to AssetId',
      editor: AssetSelector,
      settings: {
        getClient: (project, baseUrl) => cogniteClient(project, baseUrl),
      },
    })
    .addBooleanSwitch({
      path: 'withAssetSupport',
      name: 'Show asset mappings',
      defaultValue: false,
    });
  return builder;
});
