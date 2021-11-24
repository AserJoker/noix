import { useHook } from "../useHook";

export const Hook = (
  handle: (args: unknown[], next: () => unknown) => unknown
) => {
  return <T extends Object, K extends Function>(
    proto: T,
    name: string,
    descriptor: TypedPropertyDescriptor<K>
  ) => {
    descriptor.value = useHook(descriptor.value as Function, handle) as K;
  };
};
