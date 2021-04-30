import { StoreModel } from '@noix/engine';
import { BaseModel } from '@noix/engine';
import { Teacher } from './Teacher';

@BaseModel.DataModel({ module: 'mock', name: 'Student' })
export class Student extends StoreModel {
  @BaseModel.DataField({
    type: Teacher,
    array: true,
    storeRelation: true,
    rel: 'id',
    ref: 'id'
  })
  public teachers: Teacher[] = [];

  @BaseModel.DataField({ type: 'string' })
  public name = '';
}
