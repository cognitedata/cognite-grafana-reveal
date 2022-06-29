import React, { useMemo } from 'react';
import { Select } from '@grafana/ui';

export const SelectDatasourceEditor: React.FC<any> = ({
  value,
  onChange,
  item: {
    settings: { datasources, datasource },
  },
}) => (
  <Select
    options={datasources}
    value={useMemo(() => {
      if (!value) onChange(datasource);
      return value ?? datasource;
    }, [value])}
    onChange={(selectableValue) => {
      onChange(selectableValue);
    }}
  />
);
