import { BaseModel } from './BaseModel';
export class StoreModel extends BaseModel {
  @BaseModel.DataField({ type: 'string' })
  public id: string = '';
}
