import { SystemApplication, Bootstrap } from '@noix/core';
import commander from 'commander';
import path from 'path';
import fs from 'fs';
import { HttpServer, IResponseModule } from '@noix/http';
import './modules';
import { BaseModel } from '@noix/engine';
@Bootstrap
export class ServerApplication extends SystemApplication {
  private _config: Record<string, unknown> = {};

  private _serverInstance!: HttpServer;
  public async main() {
    const commandLine = this.ResolveCommandLine();
    if (commandLine.config) {
      this._config = await this.LoadConfigFile(
        path.resolve(process.cwd(), commandLine.config)
      );
    }
    this._serverInstance = new HttpServer(this._config.port as number);
    this.LoadModules();
    this._serverInstance.Bootstrap();
  }

  public ResolveCommandLine() {
    return commander
      .option('-M, --module <path>', 'modules path for server', 'modules')
      .option('-P, -port <port>', 'port for server', parseInt, 9090)
      .version('0.0.1')
      .parse(process.argv)
      .opts();
  }

  public async LoadConfigFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      return require(filePath);
    } else {
      return {};
    }
  }

  public LoadBaseModule() {
    const baseModule = {} as IResponseModule;
    baseModule.module = 'base';
    baseModule.responseHandles = {};
    const classes = BaseModel.GetAllDataModeles();
    classes.forEach((name) => {
      const DataModel = BaseModel.GetDataModel(name);
      baseModule.responseHandles![name] = async (req, res) => {
        const queryBody = req.query;
        if (Object.keys(queryBody).length) {
          const query = queryBody;
          const handle = Reflect.get(
            DataModel,
            query.query as string
          ) as Function;
          // FIXME: query.query 应当使用GraphQL进行解析运行
          const _ = await handle.apply(DataModel);
          const _r = _.map((d: any) => {
            const fields = BaseModel.GetFields(DataModel);
            const res: Record<string, unknown> = {};
            fields.forEach((finfo) => {
              res[finfo.name] = d[finfo.name];
            });
            return res;
          });
          res.body = _r;
        }
      };
    });
    baseModule.middlewareHandles = [
      async (ctx, next) => {
        ctx.query = await new Promise((resolve, reject) => {
          try {
            let postdata = '';
            ctx.req.on('data', (data: any) => {
              postdata += data;
            });
            ctx.req.on('end', function () {
              resolve(postdata === '' ? {} : JSON.parse(postdata));
            });
          } catch (error) {
            reject(error);
          }
        });
        await next();
      }
    ];
    this._serverInstance.RegisterModule(baseModule);
  }

  public LoadModules() {
    this.LoadBaseModule();
  }
}
