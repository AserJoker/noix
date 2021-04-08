import { BaseStore } from './BaseStore';
import { ValueChangeEvent } from '../event';
import { API } from '@noix/core';

@API('core', 'HandleStore')
export class HandleStore<T, K extends Object> extends BaseStore<T> {
  public constructor(
    parentStore: BaseStore<K>,
    handle: (record: T, nameOrIndex: string | number) => boolean,
    defaultValue: T | null = null
  ) {
    super({
      get: () => {
        if (parentStore.GetState() === 'released') {
          this.Release();
          return null;
        }
        const parentValue = parentStore.value as Record<string, unknown>;
        if (parentValue) {
          Object.keys(parentValue).forEach((_name) => {
            if (handle(parentValue[_name] as T, _name)) {
              return parentValue;
            }
          });
        }
        return null;
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
          if (handle(parentValue[key] as T, key)) {
            oldRecord[key] = newValue;
          } else oldRecord[key] = parentValue[key];
        });
        parentStore.value = oldRecord as K;
      }
    });
    this.value = defaultValue;
    parentStore.watch((newRecord, oldRecord) => {
      let newValue = null;
      const newParentValue = newRecord as Record<string, unknown>;
      if (newRecord) {
        Object.keys(newParentValue).forEach((name) => {
          if (handle(newParentValue[name] as T, name)) {
            newValue = newParentValue[name] as T;
          }
        });
      }
      let oldValue = null;
      const oldParentValue = oldRecord as Record<string, unknown>;
      if (newRecord) {
        Object.keys(oldParentValue).forEach((name) => {
          if (handle(oldParentValue[name] as T, name)) {
            oldValue = oldParentValue[name] as T;
          }
        });
      }
      if (oldValue !== newValue) {
        this.EVENT_BUS.Trigger(
          new ValueChangeEvent(parentStore, newValue, oldValue)
        );
      }
    });
  }
}
