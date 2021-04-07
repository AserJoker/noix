import { EventObject } from '@noix/core';
import { EVENT_VALUECHANGE, ValueChangeEvent } from '../event';
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

  private caches = new WeakMap();

  public get value() {
    const ToProxy = <K, T extends Object | Array<K>>(
      store: BaseStore<T>,
      obj: T
    ) => {
      const proxy = new Proxy(obj, {
        get: (target, name: string): unknown => {
          const kvmap = target as Record<string, unknown>;
          const raw = kvmap[name];
          if (typeof raw === 'object' && raw) {
            const res = raw;
            return res;
          } else {
            if (name === 'splice' && Array.isArray(target)) {
              return (
                ...args: [start: number, deleteCount: number, ...items: T[]]
              ) => {
                const backup: Array<K> = [];
                backup.push(...target);
                target[name].apply(backup, args);
                store.value = backup as T;
              };
            }
            return raw;
          }
        },
        set: (target: T, name: string, value: unknown): boolean => {
          const kvmap = target as Record<string, unknown>;
          const backup: Record<string, unknown> = {};
          Object.keys(kvmap).forEach((_name) => (backup[_name] = kvmap[_name]));
          backup[name] = value;
          store.value = backup as T;
          return true;
        }
      });
      return proxy;
    };
    const raw = this._store.get();
    if (typeof raw === 'object' && raw) {
      return (this.caches.get(raw as Object) as T) || ToProxy(this, raw);
    } else {
      return raw;
    }
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

  public get raw() {
    return (this.value && (this.caches.get(this.value as Object) as T)) || null;
  }
}
