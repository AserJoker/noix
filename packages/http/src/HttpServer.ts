import { EventObject } from '@noix/core';
import http, { Server } from 'http';
import Koa from 'koa';
import cors from 'koa2-cors';
import { IResponseModule } from './types/IResponseModule';
export class HttpServer extends EventObject {
  private _serverInstance: Server | null = null;

  private _serverOption = { port: 9090 };

  private _modules: IResponseModule[] = [];
  public constructor(port: number = 9090) {
    super();
    this._serverOption.port = port;
  }

  public Bootstrap() {
    const app = new Koa();
    this.InitMiddleware(app);
    this.InitRequest(app);
    this._serverInstance = http.createServer(app.callback());
    this._serverInstance.listen(this._serverOption.port);
    console.log(
      'INFO [@noix/http]: server is listening at ' + this._serverOption.port
    );
  }

  public Restart() {
    this.Close();
    this.Bootstrap();
  }

  public Close() {
    this._serverInstance && this._serverInstance.close();
    this._serverInstance = null;
    console.log('INFO [@noix/http]: server closed');
  }

  protected InitRequest(app: Koa) {
    this._modules.forEach((module) => {
      module.responseHandles &&
        Object.keys(module.responseHandles).forEach((name) => {
          app.use(async (ctx) => {
            if (ctx.path === '/' + module.module + '/' + name) {
              await module.responseHandles![name](ctx.request, ctx.response);
            }
          });
        });
    });
  }

  protected InitMiddleware(app: Koa) {
    app.use(cors());
    this._modules.forEach((module) => {
      module.middlewareHandles &&
        module.middlewareHandles.forEach((middleware) => {
          app.use(middleware);
        });
    });
  }

  public RegisterModule(module: IResponseModule) {
    const localModule = this._modules.find((m) => m.module === module.module);
    if (localModule) {
      localModule.responseHandles = module.responseHandles;
      console.log('INFO [@noix/http]: update module ' + module.module);
    } else {
      this._modules.push(module);
      console.log('INFO [@noix/http]: register module ' + module.module);
    }
  }

  public RemoveModule(module?: string) {
    if (module) {
      const index = this._modules.findIndex((m) => m.module === module);
      if (index !== -1) {
        this._modules.splice(index, 1);
      }
    } else {
      this._modules = [];
    }
  }
}
