import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'Action' })
export class Action extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name = '';
}
