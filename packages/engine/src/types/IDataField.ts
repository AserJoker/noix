import { ITemplateType } from './ITemplateType';

export interface IDataField {
  name: string;
  type: string | ITemplateType;
  array: boolean;
  required?: boolean;
}
