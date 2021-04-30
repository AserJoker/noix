import { BaseModel, IDataField, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ name: 'Function', module: 'base', pamiryKey: 'id' })
export class Function extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name: string = '';

  @BaseModel.DataField({ type: 'string', array: true })
  public params: string[] = [];

  @BaseModel.DataField({ type: 'string' })
  public model: string = '';
}
