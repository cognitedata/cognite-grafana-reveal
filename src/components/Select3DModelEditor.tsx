import React, { useEffect, useMemo, useState } from 'react';
import { Select } from '@grafana/ui';
import { get3DModelList, getRevisionId } from './helpers';

export const Select3DModelEditor: React.FC<any> = ({
  value,
  onChange,
  item: {
    settings: { getClient },
  },
  context: {
    options: { selectedDatasource, selectedProject },
  },
}) => {
  const [modelOptions, setModelOptions] = useState([]);
  const client = useMemo(() => {
    return (
      selectedDatasource?.baseUrl && selectedProject?.id && getClient(selectedProject.id, selectedDatasource?.baseUrl)
    );
  }, [selectedDatasource, selectedProject]);

  useEffect(() => {
    if (client) {
      get3DModelList(client)
        .then(setModelOptions)
        .catch((error) => {
          if (error) setModelOptions([]);
        });
    }
  }, [client]);
  return (
    <Select
      options={modelOptions}
      value={value?.modelId}
      onChange={(selectableValue) => {
        getRevisionId(client, selectableValue.id)
          .then((revisionId) => {
            onChange({ modelId: selectableValue.id, revisionId });
          })
          .catch((e) => {});
      }}
    />
  );
};
