import { EventObject } from '@noix/core';
import { ValueChangeEvent } from './event';
export abstract class Store<T = unknown> extends EventObject {
  private _Attrs: Record<string, unknown> = {};

  public abstract GetValue(): T | null;

  public SetValue(newValue: T | null): boolean {
    if (this.GetValue() === newValue) return false;
    this.EVENT_BUS.Trigger(
      new ValueChangeEvent(this, newValue, this.GetValue())
    );
    return !this.IsReadonly();
  }

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
