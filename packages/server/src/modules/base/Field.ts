import { BaseModel, IDataField, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'Field', pamiryKey: 'id' })
export class Field extends StoreModel {
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
}
