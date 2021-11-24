import { defineMetadata, getMetadata, Provide } from "@noix/core";
import { IField, IFunction } from "..";
import { BaseModel } from "../base.model";
import { IMetadata } from "../types/IMetadata";
import { IModel } from "../types/IModel";

export const Model = (model?: Omit<IModel, keyof IMetadata>) => {
  return <T extends typeof BaseModel>(classObject: T) => {
    defineMetadata(classObject, { "base:model": model || {} });
    const fields: IField[] = getMetadata(classObject, "base:fields") || [];
    const funs: IFunction[] = getMetadata(classObject, "base:functions") || [];
    let parent: typeof BaseModel | undefined =
      Object.getPrototypeOf(classObject);
    while (parent && typeof parent === "function") {
      const _fields: IField[] = getMetadata(parent, "base:fields") || [];
      const _funs: IFunction[] = getMetadata(parent, "base:functions") || [];
      _fields.forEach((f) => {
        if (!fields.find((_f) => _f.name === f.name)) {
          fields.push({
            ...f,
          });
        }
      });
      _funs.forEach((f) => {
        if (!funs.find((_f) => _f.name === f.name)) {
          funs.push({
            ...f,
          });
        }
      });
      parent = Object.getPrototypeOf(parent);
    }
    defineMetadata(classObject, {
      "base:fields": fields,
      "base:functions": funs,
    });
    Provide(Symbol(classObject.name.toLowerCase()))(classObject);
  };
};
