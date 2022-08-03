import React, { useMemo } from 'react';
import { Select } from '@grafana/ui';
import { DataSourceSrv, getDataSourceSrv } from '@grafana/runtime';
import { getAllProjectSettings } from '../utils';

export const SelectDatasourceEditor: React.FC<any> = ({ value, onChange }) => {
  const { defaultName, datasources }: DataSourceSrv & any = getDataSourceSrv();
  const { options, datasource } = getAllProjectSettings({ defaultName, datasources });
  return (
    <Select
      options={options}
      value={useMemo(() => {
        if (!value) onChange(datasource);
        return value ?? datasource;
      }, [value])}
      onChange={(selectableValue) => {
        onChange(selectableValue);
      }}
    />
  );
};
