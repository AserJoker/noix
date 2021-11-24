import { defineMetadata, getMetadata } from "@noix/core";

export function Method(method: string, path: string) {
  return <T extends Object, K extends Function>(
    proto: T,
    name: string,
    descriptor: TypedPropertyDescriptor<K>
  ) => {
    const classObject = proto.constructor as Function;
    const getters: [string, string, string][] =
      getMetadata(classObject, "mvc:handles") || [];
    getters.push([path.endsWith("/") ? path : path + "/", method, name]);
    defineMetadata(classObject, { "mvc:handles": getters });
  };
}
export function Get(
  path: string
): <T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => void;
export function Get<T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
): void;
export function Get(...args: unknown[]): unknown {
  if (args.length === 1) {
    const [path] = args as [string];
    return Method("GET", path);
  } else {
    const [proto, name, descriptor] = args as [
      Object,
      string,
      TypedPropertyDescriptor<Function>
    ];
    return Method("GET", "/")(proto, name, descriptor);
  }
}
export function Post(
  path: string
): <T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => void;
export function Post<T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
): void;
export function Post(...args: unknown[]): unknown {
  if (args.length === 1) {
    const [path] = args as [string];
    return Method("POST", path);
  } else {
    const [proto, name, descriptor] = args as [
      Object,
      string,
      TypedPropertyDescriptor<Function>
    ];
    return Method("POST", "/")(proto, name, descriptor);
  }
}
export function Patch(
  path: string
): <T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => void;
export function Patch<T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
): void;
export function Patch(...args: unknown[]): unknown {
  if (args.length === 1) {
    const [path] = args as [string];
    return Method("PATCH", path);
  } else {
    const [proto, name, descriptor] = args as [
      Object,
      string,
      TypedPropertyDescriptor<Function>
    ];
    return Method("PATCH", "/")(proto, name, descriptor);
  }
}
export function Delete(
  path: string
): <T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => void;
export function Delete<T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
): void;
export function Delete(...args: unknown[]): unknown {
  if (args.length === 1) {
    const [path] = args as [string];
    return Method("DELETE", path);
  } else {
    const [proto, name, descriptor] = args as [
      Object,
      string,
      TypedPropertyDescriptor<Function>
    ];
    return Method("DELETE", "/")(proto, name, descriptor);
  }
}
export function PUT(
  path: string
): <T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => void;
export function PUT<T extends Object, K>(
  proto: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
): void;
export function PUT(...args: unknown[]): unknown {
  if (args.length === 1) {
    const [path] = args as [string];
    return Method("PUT", path);
  } else {
    const [proto, name, descriptor] = args as [
      Object,
      string,
      TypedPropertyDescriptor<Function>
    ];
    return Method("PUT", "/")(proto, name, descriptor);
  }
}
