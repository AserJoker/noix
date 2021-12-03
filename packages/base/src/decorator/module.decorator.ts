import { Controller, IMiddleware, Middleware, Param } from "@noix/mvc";
import { NoixService } from "../service/noix.service";
import { IModule } from "../types";
import { Context, Next } from "koa";
import { IFactory, Inject, CURRENT_FACTORY } from "@noix/core";
export const Module = (info: IModule, models: Function[]) => {
  class _Module implements IMiddleware {
    private _service: NoixService;
    public use = (ctx: Context, next: Next) => {
      if (ctx.method === "POST" && ctx.path === "/" + info.name) {
        ctx.service = this._service;
      }
      return next();
    };
    public constructor(@Inject(CURRENT_FACTORY) factory: IFactory) {
      this._service = new NoixService(info.name, models, factory);
    }
  }
  return <T extends Function>(classObject: T) => {
    Middleware(_Module)(classObject);
    Controller("/" + info.name)(classObject);
  };
};
export const Service = Param("service");
