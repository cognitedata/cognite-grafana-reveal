export interface D3ModelOptions {
  selected3DModel: any;
  list3DModels?: any[];
  withAssetSupport: boolean;
  zoomToAssetId: number;
  listAssets?: any[];
  client?: {
    [x: string]: any;
  };
}

export enum D3ModelOptionsType {
  model = 'selected3DModel',
  models = 'list3DModels',
  withAssets = 'withAssetSupport',
  zoom = 'zoomToAssetId',
  assets = 'listAssets',
}
