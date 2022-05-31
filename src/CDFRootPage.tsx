import { AppRootProps } from '@grafana/data';
import React, { useEffect, useMemo } from 'react';
import { pages } from './pages';
import { useNavModel } from './utils/hooks';

export const CDFRootPage = (props: AppRootProps) => {
  const {
    path,
    onNavChanged,
    query: { tab },
    meta,
  } = props;
  console.log(props);

  // Required to support grafana instances that use a custom `root_url`.
  const pathWithoutLeadingSlash = path.replace(/^\//, '');

  // Update the navigation when the tab or path changes
  const navModel = useNavModel(
    useMemo(() => ({ tab, pages, path: pathWithoutLeadingSlash, meta }), [meta, pathWithoutLeadingSlash, tab])
  );
  useEffect(() => {
    onNavChanged(navModel);
  }, [navModel, onNavChanged]);

  const Page = pages.find(({ id }) => id === tab)?.component || pages[0].component;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Page {...props} path={pathWithoutLeadingSlash} />;
};
