import { ModelDataProvider } from '@cognite/reveal/extensions/datasource';
import { HttpHeaders } from '@cognite/sdk/dist/src';

export class D3ModelDataProvider implements ModelDataProvider {
  public readonly headers: HttpHeaders = {};

  async getJsonFile(baseUrl: string, fileName: string): Promise<any> {
    console.log(this);
    const url = `${baseUrl}/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not fetch '${url}'`);
    }
    return response.json();
  }

  async getBinaryFile(baseUrl: string, fileName: string): Promise<ArrayBuffer> {
    console.log(this);
    const url = `${baseUrl}/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not fetch '${url}'`);
    }
    return response.arrayBuffer();
  }
}
