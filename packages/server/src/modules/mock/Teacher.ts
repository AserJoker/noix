import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'mock', name: 'Teacher' })
export class Teacher extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name: string = '';
}
