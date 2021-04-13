import { BaseStore } from './BaseStore';
import { SimpleStore } from './SimpleStore';

export class BackupStore<T> extends SimpleStore<T> {
  private _sourceStore: BaseStore<T>;
  public constructor(sourceStore: BaseStore<T>) {
    super();
    this._sourceStore = sourceStore;
  }

  public Backup() {
    this.value = this._sourceStore.value;
    this._sourceStore.Lock();
  }

  public WriteBack() {
    this._sourceStore.Unlock();
    this._sourceStore.value = this.value;
  }
}
