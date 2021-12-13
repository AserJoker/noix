import { defineValidator, useValidator } from "./validate.decorator";

export const NoEmptyObject = (arg_name: string) => {
  return <T extends Object>(proto: T, name: string, index: number) => {
    useValidator(proto, name, index, "no-empty-object", arg_name);
  };
};
defineValidator(
  "no-empty-object",
  (value: unknown, name: string, index: number, arg_name: string) => {
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      const keys = Object.keys(record).filter((key) => record[key]);
      if (keys.length === 0) {
        throw new Error(`'${arg_name}' is an empty object`);
      }
    }
  }
);
