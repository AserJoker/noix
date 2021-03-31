import { EventObject } from '@noix/core';
export abstract class Store<T = unknown> extends EventObject {
  private _Attrs: Record<string, unknown> = {};

  public abstract GetValue(): T | null;

  public abstract SetValue(newValue: T | null): boolean;

  public IsNull() {
    return this.GetValue() === null;
  }

  protected _SetAttr(name: string, value: unknown) {
    this._Attrs[name] = value;
  }

  protected _GetAttr(name: string) {
    return this._Attrs[name];
  }

  public SetReadonly(readonly: boolean) {
    this._SetAttr('readonly', readonly);
  }

  public IsReadonly() {
    return this._GetAttr('readonly') as boolean;
  }
}
