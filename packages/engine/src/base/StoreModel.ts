import { DataSource } from '../service';
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

  public static async InitDataSource() {
    await super.InitDataSource();
    if (!this.info.pamiryKey) {
      this.info.pamiryKey = 'id';
    }
    return DataSource.CreateTable(this);
  }
}
