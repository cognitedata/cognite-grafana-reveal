import React from 'react';
import { AsyncMultiSelect, Field, InlineFormLabel, Switch } from '@grafana/ui';
import _ from 'lodash';
import CogniteDatasource from '../datasource';
import { SelectedProps } from './queryEditor';

export const ExtractionPipelinesTab = (
  props: SelectedProps & { datasource: CogniteDatasource }
) => {
  const {
    query: { extractionPipelinesQuery },
    onQueryChange,
    datasource,
  } = props;
  const { numeric, ids, enableAllExtractionPipelines } = extractionPipelinesQuery;
  return (
    <div className="width100p-row">
      <Field label="Extaction Pipeline: ">
        <AsyncMultiSelect
          loadOptions={() =>
            datasource.extractionPipelinesDatasource.getAllExtractionPipelines().then((res) =>
              _.map(res, ({ name, externalId }) => ({
                label: name,
                value: externalId,
                id: externalId,
              }))
            )
          }
          value={ids}
          defaultOptions
          allowCustomValue
          placeholder="Select extraction pipeline"
          className="cognite-dropdown width-20"
          onChange={(values) =>
            onQueryChange({
              extractionPipelinesQuery: {
                ...extractionPipelinesQuery,
                ids: values,
              },
            })
          }
        />
      </Field>
      <div className="gf-form" style={{ marginTop: 18 }}>
        <InlineFormLabel tooltip="Fetch all extractionpipelines" width={12}>
          List all Extraction Pipelines
        </InlineFormLabel>
        <div className="gf-form-switch">
          <Switch
            value={enableAllExtractionPipelines}
            onChange={() =>
              onQueryChange({
                extractionPipelinesQuery: {
                  ...extractionPipelinesQuery,
                  enableAllExtractionPipelines: !enableAllExtractionPipelines,
                },
              })
            }
          />
        </div>
      </div>
      <div className="gf-form" style={{ marginTop: 18 }}>
        <InlineFormLabel tooltip="Change Status to numeric value" width={12}>
          Change to numeric status
        </InlineFormLabel>
        <div className="gf-form-switch">
          <Switch
            value={numeric}
            onChange={() =>
              onQueryChange({
                extractionPipelinesQuery: {
                  ...extractionPipelinesQuery,
                  numeric: !numeric,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
