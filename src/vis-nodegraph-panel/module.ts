import { PanelPlugin } from '@grafana/data';
import { VisNodeGrahOptions } from './types';
import { VisNodeGrahPanel } from './VisNodeGrahPanel';

export const plugin = new PanelPlugin<VisNodeGrahOptions>(VisNodeGrahPanel).setPanelOptions((builder) => {
  return builder
    .addBooleanSwitch({
      path: 'hierarchical',
      name: 'Hierarchical View',
      defaultValue: true,
    })
    .addColorPicker({
      path: 'nodesColor',
      name: 'Nodes color',
    })
    .addColorPicker({
      path: 'edgesColor',
      name: 'Edges color',
    });
});
