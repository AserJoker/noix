import { Context, Next } from "koa";
import { IRuntime } from "./IRuntime";
export interface IGuard {
  active: (ctx: Context, runtime: IRuntime) => boolean | Promise<boolean>;
  reject?: () => string;
}
