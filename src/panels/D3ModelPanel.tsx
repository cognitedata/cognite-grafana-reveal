import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import D3Viewer from '../components/D3Viewer';

// @ts-ignore
const D3ModelPanel = (props) => {
  const { options, data, width, height } = props;
  const style = { width, height };
  const { series } = data;
  const flatter = _.chain(series).map('source').flatMapDeep();
  const projects = flatter.filter('project').value();
  if (projects.length) {
    const goodIds = flatter
      .filter({ status: 'Done' })
      .map(({ revisionId, modelId }) => ({ revisionId, modelId }))
      .value();
    const { project, url } = _.last(projects);
    const { revisionId, modelId } = _.last(goodIds);
    return <D3Viewer {...{ modelId, revisionId, project, url, style }} />;
  }
  return <div>Select a 3D Model</div>;
};
export default D3ModelPanel;
