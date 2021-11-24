import { IMetadata } from "./IMetadata";

export enum FIELD_TYPE {
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  STRING = "STRING",
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",
  ENUM = "ENUM",
  ONE2MANY = "ONE2MANY",
  MANY2ONE = "MANY2ONE",
  ONE2ONE = "ONE2ONE",
  MANY2MANY = "MANY2MANY",
}
export interface IBaseField extends IMetadata {
  type: FIELD_TYPE;
  array?: boolean;
}
export interface ISimpleField extends IBaseField {
  type:
    | FIELD_TYPE.INTEGER
    | FIELD_TYPE.FLOAT
    | FIELD_TYPE.STRING
    | FIELD_TYPE.TEXT
    | FIELD_TYPE.BOOLEAN;
}
export interface IEnumField extends IBaseField {
  type: FIELD_TYPE.ENUM;
  options: string[] | { name: string; value: string }[];
}
export interface IComplexField extends IBaseField {
  type:
    | FIELD_TYPE.ONE2MANY
    | FIELD_TYPE.MANY2MANY
    | FIELD_TYPE.MANY2ONE
    | FIELD_TYPE.ONE2ONE;
  refModel: string;
  refs: string[];
  rels: string[];
}
export type IField = ISimpleField | IEnumField | IComplexField;
