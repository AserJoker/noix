import { getMetadata, useHook } from "../..";
import { IListener } from "../types/IListener";

export const Emit = <K extends Object, T extends Function>(
  target: K,
  name: string,
  descriptor: TypedPropertyDescriptor<T>
) => {
  const classObject = target.constructor;
  descriptor.value = useHook(
    descriptor.value as Function,
    async function (
      this: Record<string, unknown>,
      args: unknown[],
      next: () => Promise<void>
    ) {
      await next();
      const listeners: IListener[] =
        getMetadata(classObject, "event:listeners") || [];
      return Promise.all(
        listeners
          .filter((listener) => {
            return new RegExp("^" + listener.event + "$").test(
              args[0] as string
            );
          })
          .map((listener) => {
            const handle = this[listener.name] as Function;
            return handle.apply(this, args);
          })
      );
    }
  ) as T;
};
