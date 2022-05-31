import { DataQueryRequest, DataQueryResponse } from '@grafana/data';
import _ from 'lodash';
import { CogniteQuery, HttpMethod } from '../types';
import { Connector } from '../connector';

interface D3Response {
  status?: string | boolean;
  createdTime?: Date;
  message?: string;
  [x: string]: any;
}
const convert = (arr) => {
  return _.map(arr, ({ camera, published, metadata, createdTime }) => ({
    createdTime: new Date(createdTime),
    ...metadata,
  }));
};
export class D3Datasource {
  public constructor(private connector: Connector, private project: string, private url: string) {}
  private async postQuery(modelId) {
    const { data } = await this.connector.fetchData({
      path: `/3d/models/${modelId}`,
      method: HttpMethod.GET,
      data: undefined,
    });

    const revision = await this.connector.fetchItems({
      path: `/3d/models/${modelId}/revisions`,
      method: HttpMethod.GET,
      data: undefined,
    });
    return [
      _.map(revision, ({ id, fileId, status }) => ({
        modelName: data?.name,
        modelId,
        id: data?.id,
        fileId,
        revisionId: id,
        status,
      })),
    ];
  }
  private runQuery(options) {
    const { modelId } = options;
    return modelId ? this.postQuery(modelId) : [];
  }
  async query(options: DataQueryRequest<CogniteQuery>): Promise<DataQueryResponse> {
    const data = await Promise.all(
      options.targets.map((target) => {
        return this.runQuery({
          refId: target.refId,
          ...target.d3ModelQuery,
        });
      })
    );
    const all = _.filter(options.targets, {
      d3ModelQuery: { enableD3Models: true },
    }).length
      ? [convert(await this.getD3ModelsList())]
      : [];
    return {
      data: _.concat(all as D3Response, ...data, [[{ project: this.project, url: this.url }]]),
    };
  }
  async getD3ModelsList() {
    return this.connector.fetchItems({
      path: '/3d/models',
      method: HttpMethod.GET,
      data: undefined,
    });
  }
}
