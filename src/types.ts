export interface D3ModelOptions {
  selectedDatasource: any;
  selectedProject: any;
  selected3DModel: any;
  list3DModels?: any[];
  withAssetSupport: boolean;
  zoomToAssetId: number;
  listAssets?: any[];
  client?: {
    [x: string]: any;
  };
}
