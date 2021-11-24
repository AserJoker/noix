import { IField, IFunction } from ".";
import { IMetadata } from "./IMetadata";

export interface IModel extends IMetadata {
  name: string;
  displayName?: string;
  store?: boolean;
  virtual?: boolean;
  key?: string;
}
export interface IMixedModel extends IModel {
  fields: IField[];
  functions: IFunction[];
}
