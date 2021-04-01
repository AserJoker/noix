import { EventObject } from '@noix/core';

export abstract class BaseStore<T> extends EventObject {
  public abstract GetValue(): T | null;
  public abstract SetValue(newValue: T | null): boolean;
}
