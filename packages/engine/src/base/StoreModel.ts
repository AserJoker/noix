import { DataSource } from '../service';
import { BaseModel } from './BaseModel';
export class StoreModel extends BaseModel {
  private static _dataSource: DataSource | null = null;
  protected static get dataSource() {
    if (!this._dataSource || this._dataSource.model !== this) {
      this._dataSource = new DataSource(this);
    }
    return this._dataSource;
  }

  @BaseModel.DataField({ type: 'string' })
  public id: string = '';

  @BaseModel.DataField({ type: 'int' })
  public updateDate: number = 0;

  @BaseModel.DataField({ type: 'int' })
  public createDate: number = 0;

  @BaseModel.DataField({ type: 'string' })
  public createUid: string = '';

  public static async Insert<T>(record: T): Promise<T> {
    return this.dataSource.Insert(record);
  }

  public static async Update<T>(record: T): Promise<T> {
    return this.dataSource.Update(record);
  }

  public static async Delete<T>(record: T): Promise<T> {
    return this.dataSource.Delete(record);
  }
}
