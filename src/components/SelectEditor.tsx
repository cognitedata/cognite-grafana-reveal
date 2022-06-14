import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import _ from 'lodash';

export const SelectEditor: React.FC<StandardEditorProps<number>> = ({ value, onChange, context }) => (
  <Select
    options={_.map(context.options.d3models, ({ id, name }) => ({ label: name, value: id, id }))}
    value={value}
    onChange={(selectableValue) => onChange(selectableValue.value)}
  />
);
