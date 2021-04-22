import { BaseModel, StoreModel } from '@noix/engine';
import { Field } from './Field';

@BaseModel.DataModel({ module: 'base', name: 'Model' })
export class Model extends StoreModel {
  @BaseModel.DataField({ type: 'string', name: 'name' })
  public name = '';

  @BaseModel.DataField({ type: 'string', name: 'module' })
  public module = '';

  @BaseModel.DataField({
    type: Field,
    name: 'fields',
    array: true,
    ref: 'model',
    rel: 'name'
  })
  public fields: Field[] | null = null;

  public static async query(record: BaseModel): Promise<BaseModel | null> {
    const model = record as Model;
    const res = new Model();
    res.name = model.name;
    res.module = model.module;
    const dataModel = BaseModel.GetDataModel(res.module, res.name)!;
    if (!dataModel) {
      return null;
    }
    return res;
  }
}