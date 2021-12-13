import { useContext } from ".";
export interface ISchema {
  [key: string]: SchemaItem;
}
export type SchemaItem =
  | string
  | ISchema
  | [Record<string, unknown>, SchemaItem];

export interface IRequestOption {
  baseURL: string;
  middlewares?: IMiddleware[];
}
export interface IRequest {
  method: "GET" | "POST";
  url: string;
  headers?: HeadersInit;
}
export interface IMiddleware<T = unknown, K = unknown> {
  (
    request: IRequest,
    param: Record<string, unknown>,
    next: () => Promise<K>
  ): Promise<T>;
}
export interface INoixResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
class HttpClient {
  private static _cache: Map<string, HttpClient> = new Map();
  private _middlewares: IMiddleware[] = [];
  private _cache: Map<string, Promise<unknown>> = new Map();
  private _get(request: IRequest, param: Record<string, unknown>) {
    const _param: string[] = [];
    Object.keys(param).forEach((name) => {
      const value = param[name];
      _param.push(
        `${name}=${
          typeof value === "string"
            ? encodeURIComponent(value)
            : encodeURIComponent(JSON.stringify(value))
        }`
      );
    });
    const url = `${request.url}${_param.length ? `?${_param.join("&")}` : ""}`;
    return fetch(url, {
      method: "GET",
      headers: request.headers || {},
    });
  }
  private _post(request: IRequest, param: Record<string, unknown>) {
    return fetch(request.url, {
      method: "POST",
      headers: request.headers || {},
      body: JSON.stringify(param),
    });
  }

  public constructor(private _option: IRequestOption) {
    HttpClient._cache.set(this._option.baseURL, this);
    this.use(async (req, param) => {
      switch (req.method) {
        case "GET":
          return this._get(req, param);
        case "POST":
          return this._post(req, param);
      }
    });
    this.use((req, _, next) => {
      req.url = `${this._option.baseURL}${req.url}`;
      return next();
    });
    this.use<INoixResponse<unknown>, Response>(async (_, __, next) => {
      const result: Response = await next();
      if (result.status !== 200) {
        throw new Error(
          `Failed to fetch [${result.status}]: ${result.statusText}`
        );
      }
      const data: INoixResponse<unknown> = await result.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    });
    if (_option.middlewares) {
      _option.middlewares.forEach((m) => this.use(m));
    }
  }
  public use<T, K>(middleware: IMiddleware<T, K>) {
    this._middlewares.push(middleware as IMiddleware);
  }
  public request<T>(option: IRequest, param: Record<string, unknown> = {}) {
    const _execMiddleware = async (
      req: IRequest,
      param: Record<string, unknown>,
      index = 0
    ): Promise<T | undefined> => {
      if (index < this._middlewares.length) {
        const handle = this._middlewares[this._middlewares.length - index - 1];
        return handle(req, param, () =>
          _execMiddleware(req, param, index + 1)
        ) as Promise<T>;
      }
    };
    return _execMiddleware(option, param);
  }
  public static getClient(option: IRequestOption) {
    return HttpClient._cache.get(option.baseURL) || new HttpClient(option);
  }
}
export const useRequest = (option?: IRequestOption) => {
  const config = useContext().raw.config as {
    baseURL: string;
  };
  return HttpClient.getClient(option || { baseURL: config.baseURL });
};
export const query = async <T>(
  module: string,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  const request = useRequest(baseURL ? { baseURL } : undefined);
  const result = await request.request<INoixResponse<T>>(
    { url: `/${module}`, method: "POST" },
    {
      schema,
      context,
    }
  );
  return result;
};

export const callFunction = async <T>(
  model: string,
  funName: string,
  param: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  const [module, name] = model.split(".");
  const _schema: ISchema = {
    [name]: {
      [funName]: [param, schema],
    },
  };
  const d = await query<{
    [name_1: string]: {
      [funName: string]: T;
    };
  }>(module, _schema, context, baseURL);
  return d && d.data[name][funName];
};

export const queryOne = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "queryOne",
    { record },
    schema,
    context,
    baseURL
  );
};

export const insertOne = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "insertOne",
    { record },
    schema,
    context,
    baseURL
  );
};

export const updateOne = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "updateOne",
    { record },
    schema,
    context,
    baseURL
  );
};

export const insertOrUpdateOne = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "insertOrUpdateOne",
    { record },
    schema,
    context,
    baseURL
  );
};

export const deleteOne = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "deleteOne",
    { record },
    schema,
    context,
    baseURL
  );
};

export const queryList = async <T>(
  model: string,
  record: Record<string, unknown>,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<T>(
    model,
    "queryList",
    { record },
    schema,
    context,
    baseURL
  );
};
export const queryPage = async <T>(
  model: string,
  record: Record<string, unknown>,
  current: number,
  pageSize: number,
  schema: ISchema,
  context: Record<string, unknown> = {},
  baseURL?: string
) => {
  return callFunction<{ list: T[]; total: number; current: number }>(
    model,
    "queryPage",
    { record, current, pageSize },
    {
      current: "number",
      total: "number",
      list: schema,
    },
    context,
    baseURL
  );
};
