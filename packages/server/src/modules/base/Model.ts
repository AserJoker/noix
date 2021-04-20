import { BaseModel, StoreModel } from '@noix/engine';
import { Field } from './Field';

@BaseModel.DataModel({ module: 'base', name: 'Model' })
export class Model extends StoreModel {
  @BaseModel.DataField({ type: 'string', name: 'name' })
  public name = '';

  @BaseModel.DataField({ type: 'string', name: 'module' })
  public module = '';

  @BaseModel.DataField({
    type: Field.GetModelName(),
    name: 'fields',
    array: true
  })
  public fields: Field[] = [];

  public static async query(record: BaseModel): Promise<BaseModel> {
    const model = record as Model;
    const res = new Model();
    res.name = model.name;
    res.module = model.module;
    const dataModel = BaseModel.GetDataModel(res.module, res.name)!;
    res.fields = BaseModel.GetFields(dataModel).map((field) => {
      const f = new Field();
      f.name = field.name;
      const _type = field.type;
      if (typeof _type === 'string') {
        f.type = _type;
      } else {
        f.type = dataModel.GetModelName() + _type.name;
      }
      return f;
    });
    return res;
  }
}
