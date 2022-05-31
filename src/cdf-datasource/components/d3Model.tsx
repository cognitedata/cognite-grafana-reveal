import React, { useEffect, useState } from 'react';
import { Select, Field, InlineFormLabel, Switch } from '@grafana/ui';
import _ from 'lodash';
import CogniteDatasource from '../datasource';
import { SelectedProps } from './queryEditor';

export const D3ModelTab = (props: SelectedProps & { datasource: CogniteDatasource }) => {
  const {
    query: { d3ModelQuery },
    onQueryChange,
    datasource,
  } = props;
  const { modelId, enableD3Models } = d3ModelQuery;
  const [modelOptions, setModelOptions] = useState([]);
  useEffect(() => {
    datasource.d3Datasource.getD3ModelsList().then((res) =>
      setModelOptions(
        _.map(res, ({ name, id }) => ({
          label: name,
          value: id,
          id,
        }))
      )
    );
  }, []);
  return (
    <div className="width100p-row">
      <Field label="3D Model: ">
        <Select
          options={modelOptions}
          value={modelId}
          allowCustomValue
          placeholder="select 3D Model"
          className="cognite-dropdown width-20"
          onChange={(value) =>
            onQueryChange({
              d3ModelQuery: {
                ...d3ModelQuery,
                modelId: value.value,
              },
            })
          }
        />
      </Field>
      <div className="gf-form" style={{ marginTop: 18 }}>
        <InlineFormLabel tooltip="Fetch all 3D Model" width={12}>
          List all 3D Models
        </InlineFormLabel>
        <div className="gf-form-switch">
          <Switch
            value={enableD3Models}
            onChange={() =>
              onQueryChange({
                d3ModelQuery: {
                  ...d3ModelQuery,
                  enableD3Models: !enableD3Models,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
