import { IQueryParam } from './IQueryParam';
import { ITemplateType } from './ITemplateType';

export interface IQueryFunction {
  name: string;
  handle?: Function;
  params: IQueryParam<unknown>[];
  returnType: string | ITemplateType;
}
