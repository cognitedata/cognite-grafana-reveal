import React, { useEffect, useMemo, useState } from 'react';
import { Select } from '@grafana/ui';
import { getTemplateSrv, TemplateSrv } from '@grafana/runtime';
import _, { parseInt } from 'lodash';
import { getAssetMappings3D } from './helpers';

export const AssetSelector: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    item: {
      settings: { getClient },
    },
    context: {
      data,
      options: { selectedDatasource, selected3DModel, selectedProject },
    },
  } = props;
  // console.log(props);
  const [options, setOptions] = useState([]);
  const templateSrv: TemplateSrv & any = getTemplateSrv();
  const client = useMemo(() => {
    return (
      selectedDatasource?.baseUrl && selectedProject?.id && getClient(selectedProject.id, selectedDatasource.baseUrl)
    );
  }, [selectedDatasource, selectedProject]);
  useEffect(() => {
    if (selected3DModel && client) {
      getAssetMappings3D(client, selected3DModel)
        .then((options) => {
          const variablesOptions = templateSrv.getVariables();
          const o = _.map(variablesOptions, ({ current: { value, selected }, id, ...rest }) => {
            return {
              label: `$${id}`,
              value: `$${id}`,
              id: `$${id}`,
            };
          });
          return setOptions([...o, ...options]);
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
