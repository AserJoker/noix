import { getMetadata, defineMetadata } from "@noix/core";
import {
  FIELD_TYPE,
  IComplexField,
  IEnumField,
  IField,
  ISimpleField,
} from "../types";
import { IMetadata } from "../types/IMetadata";

export const Field = (
  meta:
    | Omit<ISimpleField, Exclude<keyof IMetadata, "displayName">>
    | Omit<IEnumField, Exclude<keyof IMetadata, "displayName">>
    | Omit<IComplexField, Exclude<keyof IMetadata, "displayName">>
) => {
  return <T extends Object>(proto: T, name: string) => {
    const classObject = proto.constructor;
    const _meta: IField = { ...meta } as IField;
    _meta.name = name;
    if (_meta.type === FIELD_TYPE.ENUM) {
      const options = _meta.options;
      if (typeof options[0] === "string") {
        _meta.options = options.map((o) => {
          return {
            displayName: o as string,
            name: o as string,
          };
        });
      }
    }
    const fields: IField[] = getMetadata(classObject, "base:fields") || [];
    fields.push(_meta);
    defineMetadata(classObject, { "base:fields": fields });
  };
};
