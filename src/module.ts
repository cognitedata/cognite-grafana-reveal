/* eslint-disable @typescript-eslint/no-empty-interface */
import { PanelPlugin } from '@grafana/data';
import { D3ModelOptions } from './types';
import { D3ModelPanel } from './D3ModelPanel';
import { SelectEditor } from './components/SelectEditor';

export const plugin = new PanelPlugin<D3ModelOptions>(D3ModelPanel)
  .setPanelOptions((builder) => {
    return builder.addCustomEditor({
      id: 'D3Model',
      path: 'selected3DModel',
      name: '3D Model',
      editor: SelectEditor,
    });
  })
  .useFieldConfig();
