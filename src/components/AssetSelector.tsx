import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import { cogniteClient } from '../client';
import { getAssetMappings3D } from './helpers';

export const AssetSelector: React.FC<any> = ({
  value,
  onChange,
  context: {
    data,
    options: { selected3DModel },
  },
}) => {
  const [options, setOptions] = useState([]);
  const client = cogniteClient(data);
  useEffect(() => {
    if (selected3DModel && client) {
      getAssetMappings3D(client, selected3DModel)
        .then(setOptions)
        .catch((error) => {
          if (error) setOptions([]);
        });
    }
  }, [selected3DModel, data]);
  return (
    <Select
      allowCustomValue
      options={options}
      value={value}
      onChange={(selectableValue) => onChange(selectableValue.value)}
    />
  );
};
