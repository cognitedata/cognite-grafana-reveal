import { AppPlugin } from '@grafana/data';
import { CDFConfigCtrl } from './legacy/config';
import { CDFAppSettings } from './types';

export { CDFConfigCtrl as ConfigCtrl };
// export const plugin = new AppPlugin<CDFAppSettings>();
/*
import { AppPlugin, AppRootProps } from '@grafana/data';
import { Props } from '@grafana/ui/components/Spinner/Spinner';
import { ConfigEditor } from './cdf-datasource/components/configEditor';
import { ExamplePage1 } from './config/ExamplePage1';
import { ExamplePage2 } from './config/ExamplePage2';
import { CDFRootPage } from './CDFRootPage';
import { CDFAppSettings } from './types';


.setRootPage(
  CDFRootPage as unknown as ComponentClass<AppRootProps>
)
.addConfigPage({
    title: 'Datasource',
    icon: 'info-circle',
    body: ConfigEditor,
    id: 'datasource',
  })
  .addConfigPage({
    title: 'Page 2',
    icon: 'user',
    body: ExamplePage2,
    id: 'page2',
  });
 */
