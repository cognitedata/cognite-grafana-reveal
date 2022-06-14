import ModelDataProvider from './CogniteModelDataProvider';
import ModelMetaDataProvider from './CogniteModelMetaDataProvider';
import NodesApiClient from './CogniteNodesApiClient';

export default () => ({
  getModelMetadataProvider: () => ModelMetaDataProvider,
  getModelDataProvider: () => ModelDataProvider,
  getNodesApiClient: () => NodesApiClient,
});
