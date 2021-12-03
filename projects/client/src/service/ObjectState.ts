import { BaseService, IReactiveState, State } from ".";
import { useAction } from "../hooks";
import { IViewNode } from "../types";
import sget from "lodash/get";

export class ObjectService<
  T extends Record<string, unknown>
> extends BaseService<T> {
  private _node: IReactiveState<IViewNode>;
  public constructor(defaultValue: T, node: IViewNode) {
    super(new State<T>(defaultValue));
    this._node = new State(node);
  }
  public get node() {
    return this._node;
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
    const params = pnodes.map((node) => {
      const value = node.attrs.value as string;
      if (value.startsWith("${") && value.endsWith("}")) {
        return getter(value.substring(2, value.length - 1));
      }
      return value;
    });
    const handle = useAction(node.attrs.name as string);
    if (handle) {
      return handle(...params);
    }
  }
}
