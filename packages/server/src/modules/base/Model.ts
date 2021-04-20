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
    ref: 'model'
  })
  public fields: Field[] = [];

  public static async query(record: BaseModel): Promise<BaseModel | null> {
    const model = record as Model;
    const res = new Model();
    res.name = model.name;
    res.module = model.module;
    const dataModel = BaseModel.GetDataModel(res.module, res.name)!;
    if (!dataModel) {
      return null;
    }
    res.fields = BaseModel.GetFields(dataModel).map((field) => {
      const f = new Field();
      f.name = field.name;
      f.model = dataModel.GetModelName();
      f.array = field.array || false;
      f.ref = field.ref || null;
      const _type = field.type;
      if (typeof _type === 'string') {
        f.type = _type;
      } else {
        if (typeof _type === 'object') {
          f.type = dataModel.GetModelName() + _type.name;
        } else {
          f.type = _type.GetModelName();
        }
      }
      return f;
    });
    return res;
  }
}
