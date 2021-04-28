import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'View', pamiryKey: 'id' })
export class View extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public template: string = '';

  @BaseModel.DataField({ type: 'string' })
  public name: string = '';
}
