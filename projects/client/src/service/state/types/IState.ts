import { IWatcherOption } from "./IWatcherOption";

export interface IState<T = unknown> {
  value: T;
}
export interface IReactiveState<T = unknown> extends IState<T> {
  readonly raw: T;
  setRaw(value: T): void;
  watch(handle: Function, options?: Partial<IWatcherOption>): () => void;
  watch(
    handle: Function,
    field: string,
    options?: Partial<IWatcherOption>
  ): () => void;
  watch<K>(
    handle: Function,
    getter: (ctx: T) => K,
    options?: Partial<IWatcherOption>
  ): () => void;
}
