import { PanelPlugin } from '@grafana/data';
import { D3ModelOptions } from './types';
import { D3ModelPanel } from './D3ModelPanel';
import { SelectEditor } from './components/SelectEditor';

export const plugin = new PanelPlugin<D3ModelOptions>(D3ModelPanel).setPanelOptions((builder) => {
  return builder.addCustomEditor({
    id: 'D3Model',
    path: 'd3model',
    name: '3D Model',
    editor: SelectEditor,
  });
});
