import { IReactiveState, IWatcherOption } from "./types";
import { Watcher } from "./Watcher";

export class State<T> implements IReactiveState<T> {
  private _watchers: Watcher<unknown>[] = [];
  private _value: T;
  private reactive<K>(value: K): K {
    if (!value || typeof value !== "object") {
      return value;
    }
    return new Proxy(value as Object, {
      get: (target: Object, name: string) => {
        const value = Reflect.get(target, name);
        return this.reactive(value);
      },
      set: (target: Object, name, value) => {
        Reflect.set(target, name, value);
        this.notify();
        return true;
      },
    }) as K;
  }
  public get value() {
    return this.reactive(this._value);
  }
  public set value(newValue: T) {
    this._value = newValue;
    this.notify();
  }
  public constructor(defaultValue: T) {
    this._value = defaultValue;
  }
  public get raw() {
    return this._value;
  }
  public setRaw(value: T) {
    this._value = value;
  }
  public watch<K>(
    handle: Function,
    field: string,
    options?: Partial<IWatcherOption>
  ): () => void;
  public watch<K>(
    handle: Function,
    getter: (ctx: T) => K,
    options?: Partial<IWatcherOption>
  ): () => void;
  public watch(handle: Function, options?: Partial<IWatcherOption>): () => void;
  public watch(...args: unknown[]) {
    let getter: () => unknown;
    let options: Partial<IWatcherOption>;
    if (typeof args[1] === "string" || typeof args[1] === "function") {
      getter =
        typeof args[1] === "string"
          ? () => Reflect.get(this._value as Object, args[1] as string)
          : (args[1] as () => unknown);
      options = args[2] as IWatcherOption;
    } else {
      getter = () => this._value;
      options = args[1] as IWatcherOption;
    }
    const handle = args[0] as Function;
    const watcher = new Watcher(handle, getter, options);
    this._watchers.push(watcher);
    return () => {
      const index = this._watchers.findIndex((w) => w === watcher);
      if (index !== -1) {
        this._watchers.splice(index, 1);
      }
    };
  }
  public notify() {
    this._watchers.forEach((w) => w.notify());
  }
}
