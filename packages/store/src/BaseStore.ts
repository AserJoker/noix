import { EventObject } from '@noix/core';
import { EVENT_VALUECHANGE, ValueChangeEvent } from './event';
export interface IStoreValue<T> {
  get: () => T | null;
  set?: (newValue: T | null) => void;
}
export class BaseStore<T = unknown> extends EventObject {
  protected watchers: { Release: () => void }[] = [];

  protected _storeState: 'ready' | 'locked' | 'released' = 'ready';

  protected _store: IStoreValue<T>;

  public constructor(store: IStoreValue<T>) {
    super();
    this._store = store;
  }

  public get value() {
    return this._store.get();
  }

  public set value(newValue: T | null) {
    if (this.IsLocked()) {
      return;
    }
    if (newValue !== this.value) {
      this.EVENT_BUS.Trigger(new ValueChangeEvent(this, newValue, this.value));
      this._store.set && this._store.set(newValue);
    }
  }

  public IsNull() {
    return this.value === null;
  }

  public get type() {
    return this.IsNull() ? 'null' : typeof this.value;
  }

  public GetState() {
    return this._storeState;
  }

  public Release() {
    if (this._storeState !== 'released') {
      this._storeState = 'released';
    }
    this.watchers.forEach((w) => w.Release());
    super.Release();
  }

  public watch(handle: (newValue: T | null, oldValue: T | null) => void) {
    const watcher = this.EVENT_BUS.AddEventListener(
      EVENT_VALUECHANGE,
      (event: ValueChangeEvent) => {
        handle(
          (event.GetNewValue() as T) || null,
          (event.GetOldValue() as T) || null
        );
      }
    );
    this.watchers.push(watcher);
    return watcher;
  }

  public Lock() {
    if (this._storeState === 'ready') {
      this._storeState = 'locked';
    }
  }

  public Unlock() {
    if (this._storeState === 'locked') {
      this._storeState = 'ready';
    }
  }

  public IsLocked() {
    return this._storeState === 'locked';
  }
}
