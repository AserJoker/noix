import {
  ClassMetadata,
  getClassMetadata,
  setClassMetadata,
} from "./decorator/class.metadata.decorator";
import {
  getMemberMetadata,
  MemberMetadata,
  setMemberMetadata,
} from "./decorator/member.metadata.decorator";
import {
  getParamMetadata,
  ParamMetadata,
  setParamMetadata,
} from "./decorator/param.metadata.decorator";

function Metadata(metadata: Record<string, unknown>) {
  return (target: unknown, ...args: unknown[]) => {
    if (typeof target === "function" && args.length === 0) {
      return ClassMetadata(metadata)(target as typeof Object);
    } else if (typeof args[1] === "number") {
      return ParamMetadata(metadata)(
        target as Function,
        args[0] as string,
        args[1]
      );
    } else if (typeof args[0] === "string") {
      return MemberMetadata(metadata)(target as Object, args[0]);
    } else {
      return MemberMetadata(metadata)((target as Function).prototype);
    }
  };
}

function getMetadata<T extends typeof Object, K>(target: T, key?: string): K;
function getMetadata<T extends Object, K>(
  target: T,
  name?: string,
  key?: string
): K;
function getMetadata<T extends Object, K>(
  target: T,
  name: string | undefined,
  index: number,
  key?: string
): K;
function getMetadata(target: unknown, ...args: unknown[]) {
  if (typeof target === "function") {
    return getClassMetadata(
      target as typeof Object,
      args[0] as string | undefined
    );
  } else if (typeof args[1] === "number") {
    return getParamMetadata(
      target as Object,
      args[0] as string | undefined,
      args[1],
      args[2] as string | undefined
    );
  } else {
    return getMemberMetadata(
      target as Object,
      args[0] as string,
      args[1] as string | undefined
    );
  }
}
function defineMetadata(target: unknown, ...args: unknown[]) {
  if (typeof target === "function" && args.length === 1) {
    setClassMetadata(target, args[0] as Record<string, unknown>);
  } else if (typeof args[1] === "number") {
    setParamMetadata(
      target as Object,
      args[0] as string | undefined,
      args[1] as number,
      args[2] as Record<string, unknown>
    );
  } else {
    setMemberMetadata(
      target as Object,
      args[0] as string,
      args[1] as Record<string, unknown>
    );
  }
}
export { Metadata, getMetadata, defineMetadata };
