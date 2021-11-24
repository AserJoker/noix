import { defineValidator, useValidator } from "./validate.decorator";

export const Required = <T extends Object>(
  proto: T,
  name: string,
  index: number
) => {
  useValidator(proto, name, index, "required");
};
defineValidator("required", (value: unknown, name: string, index: number) => {
  if (value == undefined) {
    throw new Error(`function '${name}' param[${index}] is required`);
  }
});
