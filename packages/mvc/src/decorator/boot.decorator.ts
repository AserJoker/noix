import { getMetadata, IFactory, Provide } from "@noix/core";
import Koa, { Context, Next } from "koa";
import cors from "koa2-cors";
import { IApplication, IMiddleware, IRuntime } from "../types";
import http from "http";
const execMiddlewares = (
  ctx: Context,
  runtime: IRuntime,
  middlewares: IMiddleware[]
) => {
  const next = async (index = 0): Promise<void> => {
    const current = middlewares[index];
    if (current) {
      return current.use(ctx, () => next(index + 1), runtime);
    }
  };
  return next();
};
export const Boot = (config: {
  controllers: Function[];
  factory: IFactory;
}) => {
  return <K extends unknown[]>(classObject: {
    new (...args: K): IApplication;
  }) => {
    const { controllers, factory } = config;
    interface IService {
      validate: (ctx: Context) => boolean;
      handle: (ctx: Context) => Promise<void>;
    }
    const services: IService[] = [];
    const $middlewares: (IMiddleware | Function)[] =
      getMetadata(classObject, "mvc:middlewares") || [];
    controllers.forEach((controller) => {
      const handles: [string, string, string][] =
        getMetadata(controller, "mvc:handles") || [];
      const controllerPath: string = getMetadata(controller, "mvc:path");
      const middlewares: (IMiddleware | Function)[] =
        getMetadata(controller, "mvc:middlewares") || [];
      const _middlewares = [...$middlewares, ...middlewares];
      const _middleware_ins = _middlewares.map((mw) => {
        if (typeof mw === "function") {
          return factory.createInstance<IMiddleware>(mw);
        } else {
          return mw;
        }
      });
      handles.forEach((handle) => {
        const [path, method, name] = handle;
        const ins = factory.createInstance<Object>(controller);
        const handle_infos: Record<string, (string | Function)[]> =
          getMetadata(controller, "mvc:handle_info") || {};
        const param_info = handle_infos[name] || [];
        services.push({
          validate: (ctx) => {
            if (ctx.method === method) {
              if (
                new RegExp("^" + controllerPath + path + "$").test(
                  ctx.path.endsWith("/") ? ctx.path : ctx.path + "/"
                )
              ) {
                return true;
              }
            }
            return false;
          },
          handle: async (ctx) => {
            if (ins) {
              const fun = Reflect.get(ins, name) as Function;
              return execMiddlewares(
                ctx,
                {
                  getClass: <T extends Function>() => controller as T,
                  getHandle: <T extends Function>() => fun.bind(ins) as T,
                },
                _middleware_ins
                  .filter((mw) => mw !== undefined)
                  .concat([
                    {
                      use: async (ctx) => {
                        const param = param_info.map((_name) => {
                          if (typeof _name === "string") {
                            return ctx[_name];
                          } else {
                            const getter = _name;
                            return getter(ctx);
                          }
                        });
                        ctx.body = await fun.call(ins, ...param);
                      },
                    },
                  ]) as IMiddleware[]
              );
            }
          },
        });
      });
    });
    const service = (ctx: Context, next: Next) => {
      const service = services.find((ser) => ser.validate(ctx));
      if (service) {
        return service.handle(ctx);
      } else {
        return next();
      }
    };
    const boot = () => {
      const koa = new Koa();
      koa.use(cors());
      koa.use(service);
      return koa.callback();
    };
    Provide("mvc:boot")(classObject);
    const ins = factory.createInstance<IApplication>(
      classObject,
      []
    ) as IApplication;
    const { port, host } = ins.getConfig("mvc");
    const server = http
      .createServer(boot())
      .listen((port as number) || 8080, (host as string) || "127.0.0.1", () =>
        ins.boot(server)
      );
  };
};
