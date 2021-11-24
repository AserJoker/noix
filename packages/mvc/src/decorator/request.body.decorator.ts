import { Context, Next } from "koa";
import { Middleware } from "./middleware.decorator";
import { IMiddleware, IRuntime } from "../types";
import { Param } from "..";

class _RequestBody implements IMiddleware {
  public async use(ctx: Context, next: Next, runtime: IRuntime) {
    if (ctx.method === "POST") {
      const { req } = ctx;
      const data = await new Promise<unknown>((resolve, reject) => {
        let bodyStr = "";
        req.on("data", (chunk: string) => {
          bodyStr += chunk;
        });
        req.on("end", () => {
          resolve(JSON.parse(bodyStr));
        });
        req.on("error", (e) => {
          reject(e);
        });
      });
      ctx.requestBody = data;
    }
    return next();
  }
}
export const RequestBody = Middleware(_RequestBody);
//export const Body = Param("requestBody");
function Body<T extends Object>(target: T, name: string, index: number): void;
function Body(
  key: string
): <T extends Object>(target: T, name: string, index: number) => void;
function Body(...args: unknown[]) {
  if (typeof args[0] === "string") {
    return Param((ctx: Context) => {
      const key = args[0] as string;
      const requestBody: Record<string, unknown> = ctx.requestBody;
      return (
        (typeof requestBody === "object" && requestBody && requestBody[key]) ||
        null
      );
    });
  } else {
    return Param("requestBody");
  }
}
export { Body };
