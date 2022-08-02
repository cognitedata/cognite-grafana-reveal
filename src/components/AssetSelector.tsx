import React, { useEffect, useMemo, useState } from 'react';
import { Select } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { getAssetMappings3D } from './helpers';

export const AssetSelector: React.FC<any> = ({
  value,
  onChange,
  item: {
    settings: { getClient },
  },
  context: {
    data,
    options: { selectedDatasource, selected3DModel, selectedProject },
  },
}) => {
  const [options, setOptions] = useState([]);
  const client = useMemo(() => {
    return (
      selectedDatasource?.baseUrl && selectedProject?.id && getClient(selectedProject.id, selectedDatasource.baseUrl)
    );
  }, [selectedDatasource, selectedProject]);
  useEffect(() => {
    if (selected3DModel && client) {
      getAssetMappings3D(client, selected3DModel)
        .then((options) => {
          return setOptions(options);
        })
        .catch((error) => {
          if (error) setOptions([]);
        });
    }
  }, [selected3DModel, data, client]);
  return (
    <Select
      allowCustomValue
      options={options}
      value={value}
      onChange={(selectableValue) => onChange(selectableValue.value)}
    />
  );
};
