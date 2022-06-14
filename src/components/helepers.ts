// @ts-ignore
import { getDataSourceSrv } from '@grafana/runtime';
const dataSourceSrv = getDataSourceSrv();
export const creatClient = async (project) => {
  let datasource = null;
  let customDataSource = null;
  // @ts-ignore
  Object.keys(dataSourceSrv.datasources).forEach((key) => {
    // @ts-ignore
    if (dataSourceSrv.datasources[key].project === project) {
      // @ts-ignore
      datasource = dataSourceSrv.datasources[key];
    }
  });
  if (datasource) {
    // @ts-ignore
    customDataSource = datasource.d3Datasource;
  }
  return customDataSource;
};
