import { BaseService, IReactiveState, State } from ".";
import {
  callFunction,
  deleteOne,
  insertOne,
  insertOrUpdateOne,
  queryOne,
  updateOne,
  useAction,
} from "../hooks";
import { IViewNode } from "../types";
import sget from "lodash/get";
import { convertViewToSchema } from "../helper/view";
import { Loading } from "../helper/loading.decorator";

export class ObjectService<
  T extends Record<string, unknown>
> extends BaseService<T> {
  private _node: IReactiveState<IViewNode>;
  private _loading: IReactiveState<boolean>;
  public constructor(defaultValue: T, node: IViewNode) {
    super(new State<T>(defaultValue));
    if (!node.attrs.model) {
      throw new Error("not a model node");
    }
    this._node = new State(node);
    this._loading = new State(false);
  }
  public get node() {
    return this._node;
  }
  public get loading() {
    return this._loading;
  }
  public async execAction(node: IViewNode): Promise<void> {
    const getter = (code: string): unknown => {
      return sget(
        {
          current: this.state.raw,
        },
        code
      );
    };
    const pnodes = node.children.filter((p) => p.name === "param");
    const param: Record<string, unknown> = {};
    pnodes.forEach((node) => {
      const value = node.attrs.value as string;
      const name = node.attrs.name as string;
      if (value.startsWith("${") && value.endsWith("}")) {
        param[name] = getter(value.substring(2, value.length - 1));
      } else {
        param[name] = value;
      }
    });
    const handle = useAction(node.attrs.name as string);
    if (handle) {
      return handle(param, this);
    }
  }
  @Loading
  public async queryOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    const data = await queryOne<T>(
      model,
      this.state.raw,
      schema,
      context,
      baseURL
    );
    if (data) {
      this.state.value = data;
    }
  }

  @Loading
  public async insertOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    const data = await insertOne<T>(
      model,
      this.state.raw,
      schema,
      context,
      baseURL
    );
    if (data) {
      this.state.value = data;
    }
  }

  @Loading
  public async updateOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    await updateOne<T>(model, this.state.raw, schema, context, baseURL);
  }

  @Loading
  public async deleteOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    await deleteOne<T>(model, this.state.raw, schema, context, baseURL);
  }

  @Loading
  public async insertOrUpdate(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    const data = await insertOrUpdateOne<T>(
      model,
      this.state.raw,
      schema,
      context,
      baseURL
    );
    if (data) {
      this.state.value = data;
    }
  }

  @Loading
  public async query(
    param: Record<string, unknown>,
    funName: string,
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    await callFunction<T>(model, funName, param, schema, context, baseURL);
  }

  @Loading
  public async mutation(
    param: Record<string, unknown>,
    funName: string,
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(this.node.raw);
    const data = await callFunction<T>(
      model,
      funName,
      param,
      schema,
      context,
      baseURL
    );
    if (data) {
      this.state.value = data;
    }
  }
}
