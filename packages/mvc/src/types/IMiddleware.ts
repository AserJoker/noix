import { Context, Next } from "koa";
import { IRuntime } from "./IRuntime";
export interface IMiddleware {
  use(ctx: Context, next: Next, runtime: IRuntime): void;
}
