/* eslint-disable class-methods-use-this */
import { ModelDataProvider } from '@cognite/reveal/extensions/datasource';
import { HttpMethod } from './types';

class CogniteModelDataProvider implements ModelDataProvider {
  constructor(private connector) {}
  public readonly headers = {};
  async getJsonFile(baseUrl: string, fileName: string): Promise<any> {
    const url = `${baseUrl}/${fileName}`;
    console.log(url, 'helllo');

    const response = await this.connector.fetchData({
      path: url,
      method: HttpMethod.GET,
      data: undefined,
    });
    return response;
  }

  async getBinaryFile(baseUrl: string, fileName: string): Promise<ArrayBuffer> {
    const url = `${baseUrl}/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not fetch '${url}'`);
    }
    return response.arrayBuffer();
  }
}

export default CogniteModelDataProvider;
