import { NodesApiClient } from '@cognite/reveal/packages/nodes-api';

export class D3ModelNodesApiClient implements NodesApiClient {
  mapTreeIndicesToNodeIds(modelId: number, revisionId: number, treeIndices: number[]): Promise<number[]> {
    console.log(this);
    // Map 1:1 - pretend treeIndices == nodeIds
    return Promise.resolve(treeIndices);
  }
  mapNodeIdsToTreeIndices(modelId: number, revisionId: number, nodeIds: number[]): Promise<number[]> {
    console.log(this);
    // Map 1:1 - pretend treeIndices == nodeIds
    return Promise.resolve(nodeIds);
  }
  determineTreeIndexAndSubtreeSizesByNodeIds(
    modelId: number,
    revisionId: number,
    nodeIds: number[]
  ): Promise<{ treeIndex: number; subtreeSize: number }[]> {
    console.log(this);
    throw new Error('Not supported.');
  }
  determineNodeAncestorsByNodeId(
    modelId: number,
    revisionId: number,
    nodeId: number,
    generation: number
  ): Promise<{ treeIndex: number; subtreeSize: number }> {
    console.log(this);
    throw new Error('Not supported.');
  }
  getBoundingBoxesByNodeIds(modelId: number, revisionId: number, nodeIds: number[]): Promise<THREE.Box3[]> {
    console.log(this);
    throw new Error('Not supported.');
  }
}
