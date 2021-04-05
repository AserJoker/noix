import { BaseStore } from './BaseStore';
import { ValueChangeEvent } from './event';

export const CreateChildStore = <P extends Object, C>(
  parentStore: BaseStore<P>,
  name: string | number
): BaseStore<C> => {
  const childStore = new BaseStore<C>({
    get: () => {
      if (parentStore.GetState() === 'released') {
        childStore.Release();
        return null;
      }
      const parentValue = parentStore.value as Record<string, unknown>;
      return ((parentValue && parentValue[name]) as C) || null;
    },
    set: (newValue: C | null) => {
      if (parentStore.IsLocked()) {
        return;
      }
      if (parentStore.GetState() === 'released') {
        childStore.Release();
        return;
      }
      const parentValue = parentStore.value as Record<string, unknown>;
      const oldRecord: Record<string, unknown> = {};
      Object.keys(parentValue).forEach(
        (key) => (oldRecord[key] = parentValue[key])
      );
      oldRecord[name] = newValue;
      parentStore.value = oldRecord as P;
    }
  });
  parentStore.watch((newRecord, oldRecord) => {
    const newValue =
      (newRecord && (newRecord as Record<string, unknown>)[name]) || null;
    const oldValue =
      (oldRecord && (oldRecord as Record<string, unknown>)[name]) || null;
    if (oldValue !== newValue) {
      childStore.EVENT_BUS.Trigger(
        new ValueChangeEvent(parentStore, newValue, oldValue)
      );
    }
  });
  return childStore;
};
