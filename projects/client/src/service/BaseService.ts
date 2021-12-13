import { IViewNode } from "../types";
import { IReactiveState, State } from "./state";
import sget from "lodash/get";
import { useAction } from "../hooks";

export abstract class BaseService<T = unknown> {
  private _state: IReactiveState<T>;
  private _loading: IReactiveState<boolean>;
  private _node: IReactiveState<IViewNode>;
  private _current: IReactiveState<Record<string, unknown>[]>;
  public get current() {
    return this._current;
  }
  public get state() {
    return this._state;
  }
  protected constructor(state: IReactiveState<T>, node: IViewNode) {
    this._state = state;
    if (!node.attrs.model) {
      throw new Error("not a model node");
    }
    this._node = new State(node);
    this._loading = new State(false);
    this._current = new State([]);
  }
  public get node() {
    return this._node;
  }
  public get loading() {
    return this._loading;
  }
  protected _execAction(node: IViewNode, context: Record<string, unknown>) {
    const getter = (code: string): unknown => {
      return sget(context, code);
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
      return handle(param, node, this);
    }
  }
  public abstract execAction(node: IViewNode): Promise<void>;
}
