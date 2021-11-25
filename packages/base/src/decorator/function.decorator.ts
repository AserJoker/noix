import { defineMetadata, getMetadata } from "@noix/core";
import { IFunction } from "../types";

export const Func = (meta?: {
  params?: string[];
  returnType?: string;
  displayName?: string;
  array?: boolean;
  wrapper?: string;
}) => {
  return <T extends Object, K extends Function>(
    proto: T,
    name: string,
    descriptor: TypedPropertyDescriptor<K>
  ) => {
    const classObject = proto.constructor;
    const _meta: IFunction = { ...(meta || {}) } as IFunction;
    _meta.name = name;
    _meta.params = _meta.params || [];
    const functions: IFunction[] =
      getMetadata(classObject, "base:functions") || [];
    functions.push(_meta);
    defineMetadata(classObject, { "base:functions": functions });
  };
};
