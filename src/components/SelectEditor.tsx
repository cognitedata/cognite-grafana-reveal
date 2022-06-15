import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import _ from 'lodash';

export const SelectEditor: React.FC<any> = ({
  value,
  onChange,
  context: {
    options: { list3DModels },
  },
}) => {
  const [options, setOptions] = useState(list3DModels);
  useEffect(() => {
    setOptions(list3DModels);
  }, [list3DModels]);

  return <Select options={options} value={value} onChange={(selectableValue) => onChange(selectableValue.value)} />;
};
