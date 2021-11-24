import { Context, Next } from "koa";
import { Middleware } from "./middleware.decorator";
import { IMiddleware, IRuntime } from "../types";

class _ResponseBody implements IMiddleware {
  public async use(ctx: Context, next: Next, runtime: IRuntime) {
    if (ctx.method === "POST") {
      let result: { success: boolean; message: string | null; data: unknown };
      try {
        await next();
        result = {
          success: true,
          message: null,
          data: ctx.body,
        };
      } catch (e) {
        const err = e as Error;
        console.error(err);
        result = {
          success: false,
          message: err.message,
          data: null,
        };
      }
      ctx.body = result;
    } else {
      try {
        await next();
      } catch (e) {
        const err = e as Error;
        ctx.body = err.message;
        ctx.response.status = 500;
        console.error(err);
      }
    }
  }
}
export const ResponseBody = Middleware(_ResponseBody);
