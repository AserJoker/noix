import Koa, { Response, Request } from 'koa';
export interface IResponseModule {
  module: string;
  responseHandles?: Record<
    string,
    (request: Request, response: Response) => Promise<void>
  >;
  middlewareHandles?: ((ctx: Koa.Context, next: Koa.Next) => Promise<void>)[];
}
