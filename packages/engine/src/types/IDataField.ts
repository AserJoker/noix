import { BaseModel } from '../base';
import { ITemplateType } from './ITemplateType';

export interface IDataField {
  name: string;
  type:
    | 'int'
    | 'string'
    | 'boolean'
    | 'float'
    | 'this'
    | ITemplateType
    | typeof BaseModel;
  array: boolean;
  required?: boolean;
  ref?: string;
  rel?: string;
  model: string;
}
