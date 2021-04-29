import { BaseModel } from '../base';
import { ITemplateType } from './ITemplateType';

export type FieldType =
  | 'int'
  | 'string'
  | 'boolean'
  | 'float'
  | 'text'
  | 'date'
  | 'this'
  | ITemplateType
  | typeof BaseModel;
export interface IDataField {
  name: string;
  type: FieldType;
  array: boolean;
  required?: boolean;
  ref?: string;
  rel?: string;
  model: string;
}
