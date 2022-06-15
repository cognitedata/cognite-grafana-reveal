type SeriesSize = 'sm' | 'md' | 'lg';

export interface D3ModelOptions {
  selected3DModel: string;
  list3DModels?: any[];
  withAssetSupport: boolean;
  zoomToAssetId: string;
  listAssets?: any[];
}
