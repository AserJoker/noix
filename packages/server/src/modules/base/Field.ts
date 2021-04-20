import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'Field' })
export class Field extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name = '';

  @BaseModel.DataField({ type: 'string' })
  public type = '';

  @BaseModel.DataField({ type: 'string' })
  public model = '';
}
