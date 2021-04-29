import { BaseModel } from '../base';
import { IQueryParam } from './IQueryParam';
import { ITemplateType } from './ITemplateType';

export interface IQueryFunction {
  name: string;
  handle?: Function;
  params: IQueryParam<unknown>[];
  returnType: typeof BaseModel | ITemplateType | 'this';
}
