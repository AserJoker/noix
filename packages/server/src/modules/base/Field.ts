import { BaseModel, IDataField } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'Field' })
export class Field extends BaseModel {
  @BaseModel.DataField({ type: 'string' })
  public name = '';

  @BaseModel.DataField({ type: 'string' })
  public type = '';

  @BaseModel.DataField({ type: 'string' })
  public model: string = '';

  @BaseModel.DataField({ type: 'boolean' })
  public array = false;

  @BaseModel.DataField({ type: 'string' })
  public ref: string | null = '';

  @BaseModel.DataField({ type: 'string' })
  public rel: string | null = '';

  public static async QueryByRelation(field: IDataField, ref: unknown) {
    // FIXME: 从数据库查询 select * from 'xxx' where ${field.ref} = ref
    const model = BaseModel.GetDataModel('*', ref as string);
    let fields: Field[] = [];
    if (model) {
      fields = BaseModel.GetFields(model).map((f) => {
        const field = new Field();
        Object.keys(f).forEach((name) =>
          Reflect.set(field, name, Reflect.get(f, name))
        );
        if (typeof f.type === 'function') {
          field.type = f.type.GetModelName();
        } else if (typeof f.type === 'object') {
          field.type = model.GetModelName() + f.type.name;
        }
        return field;
      });
    }
    if (field.array) {
      return fields;
    }
    return fields[0] || {};
  }
}
