import { BaseModel, StoreModel } from '@noix/engine';
import { Field } from './Field';
import { Function } from './Function';

@BaseModel.DataModel({ module: 'base', name: 'Model', pamiryKey: 'id' })
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

  @BaseModel.DataField({
    type: Function,
    name: 'functions',
    array: true,
    ref: 'model',
    rel: 'name'
  })
  public functions: Function[] | null = null;
}
