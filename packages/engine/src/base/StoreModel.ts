import { DataSource } from '../service';
import { BaseModel } from './BaseModel';
export class StoreModel extends BaseModel {
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

  public static async InitDataSource() {
    this.dataSource = new DataSource(this);
    DataSource.CreateTable(this);
  }
}
