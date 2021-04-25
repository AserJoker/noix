import { BaseModel } from '../base';

export abstract class Data<T> {
  private _model: BaseModel | null = null;

  protected get model() {
    return this._model;
  }

  public init(model: BaseModel) {
    this._model = model;
  }

  public abstract query(sql?: string): T[];
  public abstract insert(record: T): T;
  public abstract update(reocrd: T): T;
  public abstract delete(record: T): T;
  public abstract construct(): boolean;
}
