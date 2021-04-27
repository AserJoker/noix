import { EventObject } from '@noix/core';
import { BaseModel } from '../base';

export abstract class DataSource extends EventObject {
  private _model: typeof BaseModel;
  public constructor(model: typeof BaseModel) {
    super();
    this._model = model;
  }
  protected get model() {
    return this._model;
  }
  public async Exec<T>(lsp: string): Promise<T | null> {
    return null;
  }
  public async Insert<T>(record: T): Promise<T> {
    return record;
  }
  public async Update<T>(record: T): Promise<T> {
    return record;
  }
  public async Delete<T>(record: T): Promise<T> {
    return record;
  }
}
