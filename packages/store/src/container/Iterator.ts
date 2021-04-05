export abstract class Iterator<T> {
  protected abstract _Next(): Iterator<T> | null;
  protected abstract _Last(): Iterator<T> | null;
  protected abstract _SetNext(nextNode: Iterator<T> | null): void;
  protected abstract _SetLast(lastNode: Iterator<T> | null): void;
  protected abstract _GetValue(): T | null;
  protected abstract _SetValue(newValue: T | null): void;

  public get next() {
    return this._Next();
  }

  public set next(nextNode: Iterator<T> | null) {
    this._SetNext(nextNode);
  }

  public get last() {
    return this._Last();
  }

  public set last(lastNode: Iterator<T> | null) {
    this._SetLast(lastNode);
  }

  public get value() {
    return this._GetValue();
  }

  public set value(newValue: T | null) {
    this._SetValue(newValue);
  }
}
