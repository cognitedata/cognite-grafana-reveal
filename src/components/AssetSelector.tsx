import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import _ from 'lodash';

export const AssetSelector: React.FC<any> = ({
  value,
  onChange,
  context: {
    options: { listAssets },
  },
}) => {
  const [options, setOptions] = useState(listAssets);
  useEffect(() => {
    setOptions(listAssets);
  }, [listAssets]);

  return (
    <Select
      allowCustomValue
      options={options}
      value={value}
      onChange={(selectableValue) => onChange(selectableValue.value)}
    />
  );
};
