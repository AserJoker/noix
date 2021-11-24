export interface ISchema {
  [key: string]: SchemaItem;
}
export type SchemaItem =
  | string
  | ISchema
  | [Record<string, unknown>, SchemaItem];

export type ResolveHandle = (
  schema: ISchema,
  context?: Record<string, unknown>
) => Promise<unknown>;

export interface IResolver {
  [name: string]: Function;
}
