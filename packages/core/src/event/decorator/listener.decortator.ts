import { defineMetadata, getMetadata } from "../..";
import { IListener } from "../types/IListener";

export const Listener = <T extends string = string>(event: T = ".*" as T) => {
  return <K extends Object>(target: K, name: string) => {
    const classObject = target.constructor;
    const listeners: IListener[] =
      getMetadata(classObject, "event:listeners") || [];
    listeners.push({
      name,
      event,
    });
    defineMetadata(classObject, { "event:listeners": listeners });
  };
};
