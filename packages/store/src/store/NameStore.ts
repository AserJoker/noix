import { BaseStore } from './BaseStore';
import { ValueChangeEvent } from '../event';

export class NameStore<T, K extends Object> extends BaseStore<T> {
  public constructor(
    parentStore: BaseStore<K>,
    name: string,
    defaultValue: T | null = null
  ) {
    super({
      get: () => {
        if (parentStore.GetState() === 'released') {
          this.Release();
          return null;
        }
        const parentValue = parentStore.value as Record<string, unknown>;
        return ((parentValue && parentValue[name]) as T) || null;
      },
      set: (newValue: T | null) => {
        if (parentStore.IsLocked()) {
          return;
        }
        if (parentStore.GetState() === 'released') {
          this.Release();
          return;
        }
        const parentValue = parentStore.value as Record<string, unknown>;
        const oldRecord: Record<string, unknown> = {};
        Object.keys(parentValue).forEach((key) => {
          if (key !== name) {
            oldRecord[key] = parentValue[key];
          } else {
            oldRecord[name] = newValue;
          }
        });
        parentStore.value = oldRecord as K;
      }
    });
    this.value = defaultValue;
    parentStore.watch((newRecord, oldRecord) => {
      const newValue =
        (newRecord && (newRecord as Record<string, unknown>)[name]) || null;
      const oldValue =
        (oldRecord && (oldRecord as Record<string, unknown>)[name]) || null;
      if (oldValue !== newValue) {
        this.EVENT_BUS.Trigger(
          new ValueChangeEvent(parentStore, newValue, oldValue)
        );
      }
    });
  }
}
