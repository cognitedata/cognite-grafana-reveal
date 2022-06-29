import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import { mapProjectsToDropdown } from '../utils';

export const SelectProjectEditor: React.FC<any> = ({
  value,
  onChange,
  context: {
    options: { selectedDatasource },
  },
  item: {
    settings: { getClient },
  },
}) => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (selectedDatasource) {
      onChange({ id: selectedDatasource.id, label: selectedDatasource.id });
      getClient(selectedDatasource.baseUrl).then(({ data: { projects } }) => {
        setOptions(mapProjectsToDropdown(projects));
      });
    }
  }, [selectedDatasource]);
  return (
    <Select
      options={options}
      value={value}
      onChange={(selectableValue) => {
        onChange(selectableValue);
      }}
    />
  );
};
