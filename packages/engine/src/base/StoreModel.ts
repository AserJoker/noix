import { DataSource } from '../service';
import { IDataField, IQueryResult } from '../types';
import { BaseModel } from './BaseModel';
export class StoreModel extends BaseModel {
  @BaseModel.DataField({ type: 'int' })
  public id: string = '';

  @BaseModel.DataField({ type: 'date' })
  public updateDate: string = '0';

  @BaseModel.DataField({ type: 'date' })
  public createDate: string = '0';

  @BaseModel.DataField({ type: 'string' })
  public createUid: string = '';

  public static async Insert<T>(record: T): Promise<T> {
    return this.dataSource.Insert(record);
  }

  public static async Update<T>(record: T): Promise<T> {
    return this.dataSource.Update(record);
  }

  public static async InsertOrUpdate<T>(record: T): Promise<T> {
    return this.dataSource.InsertOrUpdate(record);
  }

  public static async Delete<T>(record: T): Promise<T> {
    return this.dataSource.Delete(record);
  }

  public static async InitDataSource() {
    this.dataSource = new DataSource(this);
    return DataSource.CreateTable(this);
  }

  public static async QueryList(
    size: number,
    page: number,
    condition: string
  ): Promise<IQueryResult<BaseModel>> {
    const res = await this.dataSource.Query(condition, page * size, size);
    return {
      size: res.length,
      page: page,
      total: 0,
      list: res as BaseModel[]
    };
  }
  public static async QueryByRelation(
    field: IDataField,
    value: unknown
  ): Promise<BaseModel | BaseModel[]> {
    const qlisp = `(EQU ${field.ref} ${
      typeof value === 'string' ? `"${value}"` : value
    })`;
    console.log(qlisp);
    const res = await this.dataSource.Query<BaseModel>(qlisp, -1, -1);
    if (field.array) {
      return res as BaseModel[];
    } else {
      return res[0] as BaseModel;
    }
  }
}
