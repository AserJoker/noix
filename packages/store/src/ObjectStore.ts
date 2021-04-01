import { Store } from './Store';
export type OBJECT = Record<string, unknown>;
export class ObjectStore<T extends object> extends Store<T> {
  private _value: object | T | null = null;
  public GetValue() {
    return this._value as T | null;
  }

  public SetValue(newValue: T | null) {
    if (super.SetValue(newValue)) {
      if (newValue && !this.GetValue()) {
        this._value = {};
        Object.keys(newValue).forEach((name) =>
          this.SetFieldValue(name, Reflect.get(newValue, name))
        );
        return true;
      }
      const oldKeys = Object.keys(this._value!);
      if (!newValue) {
        Object.keys(this._value!).forEach((name) => {
          this.SetFieldValue(name);
        });
        this._value = null;
        return true;
      }
      const newKeys = Object.keys(newValue!);
      oldKeys.forEach((key) => {
        if (newKeys.includes(key)) {
          this.SetFieldValue(key, Reflect.get(newValue, key) as unknown);
        } else {
          this.SetFieldValue(key);
        }
      });
      newKeys.forEach((key) => {
        if (!oldKeys.includes(key)) {
          this.SetFieldValue(key, Reflect.get(newValue, key));
        }
      });
      return true;
    } else return false;
  }

  private SetFieldValue(name: string, value?: unknown) {
    if (value) {
      Reflect.set(this._value!, name, value);
    } else {
      delete (this._value as Record<string, unknown>)[name];
    }
  }
}
