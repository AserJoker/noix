import { BaseModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'Field' })
export class Field extends BaseModel {
  @BaseModel.DataField({ type: 'string' })
  public name = '';

  @BaseModel.DataField({ type: 'string' })
  public type = '';

  @BaseModel.DataField({ type: 'string' })
  public model = '';

  @BaseModel.DataField({ type: 'boolean' })
  public array = false;

  @BaseModel.DataField({ type: 'boolean' })
  public ref = true;
}
