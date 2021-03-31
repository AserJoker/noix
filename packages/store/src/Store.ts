import { EventObject } from '@noix/core';
import { ValueChangeEvent } from './event';
export class Store<T = unknown> extends EventObject {
  private _value: T | null = null;

  private _readonly: boolean = false;

  public GetValue(): T | null {
    return this._value;
  }

  public SetValue(newValue: T | null) {
    if (newValue === this._value) return true;
    this.EVENT_BUS.TriggerSync(
      new ValueChangeEvent(this, newValue, this._value)
    );
    if (this._readonly) return false;
    this._value = newValue;
    return true;
  }

  public SetReadonly(readonly: boolean) {
    this._readonly = readonly;
  }

  public IsReadonly() {
    return this._readonly;
  }

  public IsNull() {
    return this._value === null;
  }
}
