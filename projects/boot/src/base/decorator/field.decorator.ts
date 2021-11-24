import { getMetadata, defineMetadata } from "@noix/core";
import { IComplexField, IEnumField, IField, ISimpleField } from "../types";
import { IMetadata } from "../types/IMetadata";

export const Field = (
  meta:
    | Omit<ISimpleField, keyof IMetadata>
    | Omit<IEnumField, keyof IMetadata>
    | Omit<IComplexField, keyof IMetadata>
) => {
  return <T extends Object>(proto: T, name: string) => {
    const classObject = proto.constructor;
    const _meta: IField = { ...meta } as IField;
    _meta.name = name;
    const fields: IField[] = getMetadata(classObject, "base:fields") || [];
    fields.push(_meta);
    defineMetadata(classObject, { "base:fields": fields });
  };
};
