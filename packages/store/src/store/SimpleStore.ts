import { BaseStore, IStoreValue } from './BaseStore';
import { API, DeepCopy, DeepPatch } from '@noix/core';

@API('store', 'SimpleStore')
export class SimpleStore<T> extends BaseStore<T> {
  private _value: T | null = null;
  public constructor(defaultValue: T | null = null, store?: IStoreValue<T>) {
    super(
      store || {
        get: () => this._value,
        set: (newValue: T | null) => {
          this._SetValue(newValue);
        }
      }
    );
    this.value = defaultValue;
  }

  protected _SetValue(newValue: T | null) {
    const newRecord = newValue as Record<string, unknown>;
    const oldRecord = this._value as Record<string, unknown>;
    if (newRecord && oldRecord && typeof newValue === 'object') {
      DeepPatch(oldRecord, newRecord);
    } else {
      this._value = DeepCopy(newValue);
    }
  }
}
