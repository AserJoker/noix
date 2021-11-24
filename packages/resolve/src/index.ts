import { IResolver, SchemaItem, ResolveHandle, ISchema } from './types';
export * from './types';
const useResolver = (host: IResolver): ResolveHandle => {
  const resolveHandle = async (
    schema: SchemaItem,
    resolver: Function,
    path: string,
    context: Record<string, unknown>
  ): Promise<unknown> => {
    const ctx = { path: path.substr(1), context: context || {} };
    if (!resolver) {
      return null;
    }
    if (typeof schema === 'string') {
      const data = await resolver(ctx);
      const item = Array.isArray(data) ? data[0] : data;
      if (item && typeof item !== schema) {
        throw new Error(
          `invalid value type: (${schema})${typeof data} @${path.substr(1)}`
        );
      }
      return data;
    }
    if (Array.isArray(schema)) {
      const [param, next] = schema;
      return resolveHandle(
        next,
        () => resolver(ctx, param),
        `${path}`,
        context
      );
    }
    const keys = Object.keys(schema);
    const res: Record<string, unknown> = {};
    const record = await resolver(ctx);
    if (!record) {
      return record;
    }
    if (Array.isArray(record)) {
      const arr: unknown[] = [];
      await record.reduce(async (last, r, index) => {
        await last;
        arr[index] = await resolveHandle(
          schema,
          () => r,
          `${path}[${index}]`,
          context
        );
      }, new Promise<void>((resolve) => resolve()));
      return arr;
    }
    await keys.reduce(async (last, key) => {
      await last;
      const next = schema[key];
      const resolver = record[key];
      res[key] = await resolveHandle(next, resolver, `${path}.${key}`, context);
    }, new Promise<void>((resolve) => resolve()));
    return res;
  };
  return (schema: ISchema, context: Record<string, unknown> = {}) =>
    resolveHandle(schema, () => host, '', context);
};
export { useResolver };
