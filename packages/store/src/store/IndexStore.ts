import { BaseStore } from './BaseStore';
import { ValueChangeEvent } from '../event';
import { API } from '@noix/core';

@API('store', 'IndexStore')
export class IndexStore<T, K extends Array<T>> extends BaseStore<T> {
  public constructor(
    parentStore: BaseStore<K>,
    index: number,
    defaultValue: T | null = null
  ) {
    super({
      get: () => {
        if (parentStore.GetState() === 'released') {
          this.Release();
          return null;
        }
        const parentValue = parentStore.value as Record<string, unknown>;
        return ((parentValue && parentValue[index]) as T) || null;
      },
      set: (newValue: T | null) => {
        if (parentStore.IsLocked()) {
          return;
        }
        if (parentStore.GetState() === 'released') {
          this.Release();
          return;
        }
        const parentValue = parentStore.value as T[];
        const oldRecord = [] as T[];
        parentValue.forEach((value, _index) => {
          if (_index === index) {
            oldRecord[_index] = newValue!;
          } else oldRecord[_index] = value;
        });
        if (oldRecord[index] === undefined) {
          oldRecord[index] = newValue!;
        }
        parentStore.value = oldRecord as K;
      }
    });
    this.value = defaultValue;
    parentStore.watch((newRecord, oldRecord) => {
      const newValue = (newRecord && (newRecord as T[])[index]) || null;
      const oldValue = (oldRecord && (oldRecord as T[])[index]) || null;
      if (oldValue !== newValue) {
        this.EVENT_BUS.Trigger(
          new ValueChangeEvent(parentStore, newValue, oldValue)
        );
      }
    });
  }
}
