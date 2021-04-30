import { BaseModel, DataSource, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'mock', name: 'Teacher' })
export class Teacher extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name: string = '';

  public static async InitDefaultData() {
    const mock1 = new Teacher();
    mock1.name = 't1';
    const mock2 = new Teacher();
    mock2.name = 't2';
    this.Insert(mock1);
    this.Insert(mock2);
  }
}
