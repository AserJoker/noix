import { IDataField } from './IDataField';

export interface IQueryParam<T = unknown> extends IDataField {
  index?: number;
  default?: T;
}
