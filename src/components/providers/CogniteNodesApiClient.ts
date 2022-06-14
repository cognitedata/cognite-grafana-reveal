/* eslint-disable class-methods-use-this */
import { NodesApiClient } from '@cognite/reveal/packages/nodes-api';

class CogniteNodesApiClient implements NodesApiClient {
  mapTreeIndicesToNodeIds(modelId: number, revisionId: number, treeIndices: number[]): Promise<number[]> {
    // Map 1:1 - pretend treeIndices == nodeIds
    return Promise.resolve(treeIndices);
  }
  mapNodeIdsToTreeIndices(modelId: number, revisionId: number, nodeIds: number[]): Promise<number[]> {
    // Map 1:1 - pretend treeIndices == nodeIds
    return Promise.resolve(nodeIds);
  }
  determineTreeIndexAndSubtreeSizesByNodeIds(
    modelId: number,
    revisionId: number,
    nodeIds: number[]
  ): Promise<{ treeIndex: number; subtreeSize: number }[]> {
    throw new Error('Not supported.');
  }
  determineNodeAncestorsByNodeId(
    modelId: number,
    revisionId: number,
    nodeId: number,
    generation: number
  ): Promise<{ treeIndex: number; subtreeSize: number }> {
    throw new Error('Not supported.');
  }
  getBoundingBoxesByNodeIds(modelId: number, revisionId: number, nodeIds: number[]): Promise<THREE.Box3[]> {
    throw new Error('Not supported.');
  }
}

export default CogniteNodesApiClient;
