import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import { cogniteClient } from '../client';
import { get3DModelList, getRevisionId } from './helpers';

export const SelectEditor: React.FC<any> = ({ value, onChange, context: { data } }) => {
  const [options, setOptions] = useState([]);
  const client = cogniteClient(data);
  useEffect(() => {
    if (client) {
      get3DModelList(client)
        .then(setOptions)
        .catch((error) => {
          if (error) setOptions([]);
        });
    }
  }, [data]);

  return (
    <Select
      options={options}
      value={value?.modelId}
      onChange={(selectableValue) => {
        getRevisionId(client, selectableValue.id)
          .then((revisionId) => {
            onChange({ modelId: selectableValue.id, revisionId });
          })
          .catch((e) => {
            if (e) console.log('error change', e);
          });
      }}
    />
  );
};
