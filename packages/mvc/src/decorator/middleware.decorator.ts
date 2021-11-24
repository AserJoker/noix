import { defineMetadata, getMetadata } from "@noix/core";
import { IMiddleware } from "../types/IMiddleware";

export const Middleware = (middleware: IMiddleware | Function) => {
  return <T extends Function | Object>(target: T) => {
    const middlewares: (IMiddleware | Function)[] =
      getMetadata(target, "mvc:middlewares") || [];
    middlewares.push(middleware);
    defineMetadata(target, { "mvc:middlewares": middlewares });
  };
};
