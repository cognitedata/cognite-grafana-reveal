import { DataQueryRequest, DataQueryResponse, TimeRange } from '@grafana/data';
import _ from 'lodash';
import { CogniteQuery, HttpMethod } from '../types';
import { Connector } from '../connector';

interface ExtractionPipelinesResponse {
  status?: string | boolean;
  createdTime?: Date;
  message?: string;
  [x: string]: any;
}
// eslint-disable-next-line no-nested-ternary
const evalStatus = (text) => (text === 'success' ? 1 : text === 'failure' ? 0 : 2);
const convert = (arr) => {
  return _.map(
    arr,
    ({
      metadata,
      createdTime,
      lastSeen,
      lastSuccess,
      lastUpdatedTime,
      lastFailure,
      contacts,
      ...rest
    }) => ({
      ...rest,
      createdTime: new Date(createdTime),
      lastSeen: new Date(lastSeen),
      lastSuccess: new Date(lastSuccess),
      lastUpdatedTime: new Date(lastUpdatedTime),
      lastFailure: new Date(lastFailure),
      ...contacts,
      ...metadata,
    })
  );
};
export class ExtractionPipelinesDatasource {
  public constructor(private connector: Connector) {}
  private postQuery(id, numeric) {
    return this.connector
      .fetchItems({
        path: '/extpipes/runs/list',
        method: HttpMethod.POST,
        data: { filter: { externalId: id } },
      })
      .then((response): ExtractionPipelinesResponse[] =>
        numeric
          ? _.map(response, ({ status, createdTime, ...rest }) => ({
              ...rest,
              status: evalStatus(status),
              createdTime: new Date(createdTime),
              id: `${id}`,
            }))
          : response
      );
  }
  private runQuery(options) {
    const { ids, numeric } = options;
    return Promise.all(_.map(ids, ({ id }) => this.postQuery(id, numeric)));
  }
  async query(options: DataQueryRequest<CogniteQuery>): Promise<DataQueryResponse> {
    const data = await Promise.all(
      options.targets.map((target) => {
        return this.runQuery({
          refId: target.refId,
          ...target.extractionPipelinesQuery,
        });
      })
    );
    const all = _.filter(options.targets, {
      extractionPipelinesQuery: { enableAllExtractionPipelines: true },
    }).length
      ? [convert(await this.getAllExtractionPipelines())]
      : [];
    return {
      data: _.concat(all as ExtractionPipelinesResponse, ...data),
    };
  }
  async getAllExtractionPipelines() {
    return this.connector.fetchItems({
      path: '/extpipes',
      method: HttpMethod.GET,
      data: undefined,
    });
  }
}
