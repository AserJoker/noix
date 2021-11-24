import { getMetadata } from "@noix/core";
import { Context, Next } from "koa";
import { Middleware } from "..";
import { IGuard, IRuntime } from "../types";

export const Guard = (guard: IGuard) => {
  return Middleware(
    class {
      public async use(ctx: Context, next: Next, runtime: IRuntime) {
        if (await guard.active(ctx, runtime)) {
          return next();
        } else {
          throw new Error((guard.reject && guard.reject()) || "guard trigged");
        }
      }
    }
  );
};
