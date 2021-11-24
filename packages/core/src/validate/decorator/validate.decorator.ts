import { CustomValidate } from "./custom.validate.decorator";
import { getMetadata, defineMetadata } from "../../metadata";

const validators = new Map<string | symbol, Function>();

export const useValidator = <T extends Object>(
  proto: T,
  name: string,
  index: number,
  validator_name: string | symbol,
  ...args: unknown[]
) => {
  const validateInfo =
    (getMetadata(proto, name, "validate:info") as [
      string | symbol,
      unknown[]
    ][][]) || [];
  const current = validateInfo[index] || [];
  if (!current.map((c) => c[0]).includes(validator_name)) {
    current.push([validator_name, args]);
  }
  validateInfo[index] = current;
  defineMetadata(proto, name, { "validate:info": validateInfo });
};
export const defineValidator = (name: string | symbol, handle: Function) => {
  validators.set(name, handle);
};
export const Validate = <T extends Object, K extends Function>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => {
  const validator_info =
    (getMetadata(proto, name, "validate:info") as [
      string | symbol,
      unknown[]
    ][][]) || [];
  CustomValidate((...args: unknown[]) => {
    validator_info.forEach((_validators, index) => {
      const value = args[index];
      _validators.forEach((validator) => {
        const validator_handle = validators.get(validator[0]);
        if (validator_handle) {
          validator_handle(value, name, index, ...validator[1]);
        }
      });
    });
  })(proto, name, descriptor);
};
