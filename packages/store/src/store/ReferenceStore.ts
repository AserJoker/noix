import { BaseStore } from './BaseStore';
import { ValueChangeEvent } from '../event';

export class ReferenceStore<T> extends BaseStore<T> {
  public constructor(sourceStore: BaseStore<T>) {
    super({
      get: () => {
        if (sourceStore.GetState() === 'released') {
          this.Release();
          return null;
        }
        return sourceStore.value;
      },
      set: (newValue: T | null) => {
        if (sourceStore.GetState() === 'released') {
          this.Release();
          return;
        }
        if (sourceStore.IsReady()) {
          sourceStore.value = newValue;
        }
      }
    });
    sourceStore.watch((a, b) => {
      this.EVENT_BUS.Trigger(new ValueChangeEvent(this, a, b));
    });
  }
}
