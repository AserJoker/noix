import { useHook } from "../../hook";

export const CustomValidate = (handle: Function) => {
  return <T extends Object, K extends Function>(
    target: T,
    name: string,
    descriptor: TypedPropertyDescriptor<K>
  ) => {
    const body = descriptor.value as Function;
    descriptor.value = useHook(
      body,
      function (this: T, args: unknown[], next: Function) {
        try {
          handle(...args);
          return next();
        } catch (e) {
          throw e;
        }
      }
    ) as K;
  };
};
