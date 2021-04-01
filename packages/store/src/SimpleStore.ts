import { Store } from './Store';

export class SimpleStore<T extends string | number | boolean> extends Store<T> {
  private _value: T | null = null;
  public SetValue(newValue: T) {
    if (super.SetValue(newValue)) {
      this._value = newValue;
      return true;
    }
    return false;
  }

  public GetValue(): T | null {
    return this._value;
  }
}
