import { BaseModel, IDataField, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ name: 'Function', module: 'base', pamiryKey: 'id' })
export class Function extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public name: string = '';

  @BaseModel.DataField({ type: 'string', array: true })
  public params: string[] = [];

  @BaseModel.DataField({ type: 'string' })
  public model: string = '';

  public static async QueryByRelation(
    field: IDataField,
    value: unknown
  ): Promise<BaseModel | BaseModel[]> {
    const dataModel = BaseModel.GetDataModel('*', field.model);
    if (dataModel) {
      const funs = BaseModel.GetFunctions(dataModel);
      return funs.map((f) => {
        const funObject = new Function();
        funObject.name = f.name;
        funObject.model = field.model;
        funObject.params = f.params.map((p) => p.name);
        return funObject;
      });
    }
    return [];
  }
}
