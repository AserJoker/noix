import { IViewNode } from "../types";
import { IReactiveState, State } from "./state";

export abstract class BaseService<T> {
  private _state: IReactiveState<T>;
  private _busy: IReactiveState<boolean>;
  public get state() {
    return this._state;
  }
  public get busy() {
    return this._busy;
  }
  public setBusy(busy: boolean) {
    this._busy.value = busy;
  }
  protected constructor(state: IReactiveState<T>) {
    this._state = state;
    this._busy = new State(false);
  }
  public abstract execAction(node: IViewNode): Promise<void> | void;
}
