import { clone } from "./clone";
import { IWatcherOption } from "./types/IWatcherOption";

export class Watcher<T> {
  private _handle: Function;
  private _getter: () => T;
  private _old: T;
  public notify() {
    const newValue = this._getter();
    this._handle(newValue, this._old);
    this._old = clone(newValue);
  }
  public constructor(
    handle: Function,
    getter: () => T,
    options?: Partial<IWatcherOption>
  ) {
    this._getter = getter;
    this._old = clone(getter());
    this._handle = handle;
    if (options?.immediate) {
      this.notify();
    }
  }
}
