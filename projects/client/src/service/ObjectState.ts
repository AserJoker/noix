import { BaseService, IReactiveState, State } from ".";
import {
  callFunction,
  deleteOne,
  insertOne,
  insertOrUpdateOne,
  queryOne,
  updateOne,
} from "../hooks";
import { IViewNode } from "../types";
import { convertViewToSchema } from "../helper/view";
import { Loading } from "../helper/loading.decorator";

export class ObjectService<
  T extends Record<string, unknown>
> extends BaseService<T> {
  private _fields: Record<string, () => IViewNode> = {};
  private _validateInfo: IReactiveState<Record<string, string>>;
  public constructor(defaultValue: IReactiveState<T>, node: IViewNode) {
    super(defaultValue, node);
    const resolveFields = (n: IViewNode) => {
      if (n.attrs.field) {
        this._fields[n.attrs.field as string] = () => n;
      } else {
        n.children.forEach((c) => resolveFields(c));
      }
    };
    resolveFields(this.getFormNode());
    this._validateInfo = new State({});
    this.current.value = [this.state.raw];
  }
  public setField(name: string, getter: () => IViewNode) {
    this._fields[name] = getter;
  }
  public get validateInfo() {
    return this._validateInfo;
  }
  private _computed(code: string) {
    const _is = new Function("current", `return ${code}`);
    return _is(this.state.raw);
  }
  public isDisabled(node: IViewNode) {
    const state = node.attrs["disabled"] as string;
    if (node.attrs.value) {
      return true;
    }
    if (!state) {
      return false;
    }
    if (state.startsWith("${") && state.endsWith("}")) {
      return !!this._computed(state.substring(2, state.length - 1));
    } else {
      return state === "true";
    }
  }
  public isInvisible(node: IViewNode) {
    const state = node.attrs["invisible"] as string;
    if (!state) {
      return false;
    }
    if (state.startsWith("${") && state.endsWith("}")) {
      return !!this._computed(state.substring(2, state.length - 1));
    } else {
      return state === "true";
    }
  }
  public computed(node: IViewNode) {
    return this._computed(node.attrs.value as string);
  }
  public getField(name: string) {
    const getter = this._fields[name];
    if (getter) {
      return getter();
    }
  }
  public async execAction(node: IViewNode): Promise<void> {
    return super._execAction(node, {
      current: this.state.raw,
    });
  }
  protected getFormNode() {
    return this.node.raw.children.find((c) => c.name === "form") as IViewNode;
  }
  @Loading
  public async queryOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
    const record: Record<string, unknown> = {};
    const key = (node.attrs.key as string) || "code";
    record[(node.attrs.key as string) || "code"] = this.state.raw[key];
    const data = await queryOne<T>(model, record, schema, context, baseURL);
    if (data) {
      this.state.value = data;
    }
  }

  @Loading
  public async insertOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
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
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
    await updateOne<T>(model, this.state.raw, schema, context, baseURL);
  }

  @Loading
  public async deleteOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
    await deleteOne<T>(model, this.state.raw, schema, context, baseURL);
  }

  @Loading
  public async insertOrUpdateOne(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
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
  public async submit(
    param: Record<string, unknown>,
    funName: string,
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
    await callFunction<T>(model, funName, param, schema, context, baseURL);
  }

  @Loading
  public async mutation(
    param: Record<string, unknown>,
    funName: string,
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const node = this.getFormNode();
    const model = node.attrs.model as string;
    const schema = convertViewToSchema(node);
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
  public async validate() {
    const fields = Object.keys(this._fields);
    const result: Record<string, string> = {};
    fields.forEach((name) => {
      const node = this.getField(name);
      if (node) {
        if (node.attrs.required === "true") {
          if (!this.state.raw[name])
            result[name] =
              (node.attrs.requiredMessage as string) ||
              `${node.attrs.displayName} is required`;
        }
      }
    });
    this.validateInfo.value = result;
    if (Object.keys(result).length) {
      throw new Error("validate failed");
    }
  }
}
