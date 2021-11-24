import { defineValidator, useValidator } from "./validate.decorator";

export const TypeCheck =
  (
    type:
      | "string"
      | "number"
      | "bigint"
      | "boolean"
      | "symbol"
      | "undefined"
      | "object"
      | "function"
  ) =>
  <T extends Object>(proto: T, name: string, index: number) => {
    useValidator(proto, name, index, "type_check", type);
  };
defineValidator(
  "type_check",
  (value: unknown, name: string, index: number, type: string) => {
    if (typeof value !== type) {
      throw new Error(`function '${name}' param[${index}] is not a ${type}`);
    }
  }
);
