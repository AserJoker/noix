import axios, { AxiosInstance } from 'axios';
import { EventObject } from '@noix/core';
export class HttpClient extends EventObject {
  private _instance: AxiosInstance | null = null;

  public SetBaseURL(url: string) {
    this._instance = axios.create({
      baseURL: url,
      responseType: 'json'
    });
  }

  public async Get<T>(path: string, param: Record<string, unknown>) {
    if (this._instance) {
      const result = await this._instance.get<T>(path, {
        data: param
      });
      if (result.status === 200) {
        return result.data;
      }
    }
    return null;
  }

  public async Post<T>(path: string, param: Record<string, unknown>) {
    if (this._instance) {
      const result = await this._instance.post<T>(path, param);
      if (result.status === 200) {
        return result.data;
      }
    }
    return null;
  }

  public GetAxiosInstance() {
    return this._instance;
  }

  private GQLStringify(data: unknown): string {
    const type = typeof data;
    if (data === 'null') return 'null';
    switch (type) {
      case 'number':
      case 'boolean':
        return `${data}`;
      case 'string':
        return `"${data}"`;
      case 'object': {
        if (Array.isArray(data)) {
          return `[${data.map((d) => this.GQLStringify(d)).join(',')}]`;
        } else {
          return `{${Object.keys(data as Object)
            .filter(
              (name) => (data as Record<string, unknown>)[name] !== undefined
            )
            .map(
              (name) =>
                `${name}:${this.GQLStringify(
                  (data as Record<string, unknown>)[name]
                )}`
            )
            .join(',')}}`;
        }
      }
    }
    return '';
  }

  public async Query<T>(
    module: string,
    model: string,
    func: string,
    param: Record<string, unknown>,
    queryBody: string
  ) {
    const queryStr = `{
      ${model.toLowerCase()}{
        ${func}(${Object.keys(param)
      .filter((name) => param[name] !== undefined)
      .map((name) => `${name}:${this.GQLStringify(param[name])}`)
      .join(',')})
      ${queryBody}
      }
    }`;
    const res = await this.Post<{
      data: Record<string, Record<string, unknown>>;
    }>(module, {
      oeprationName: null,
      variables: {},
      query: queryStr
    });
    return (
      ((res && res.data && res.data[model.toLowerCase()][func]) as T) || null
    );
  }
}
