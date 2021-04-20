import { SystemApplication, Bootstrap } from '@noix/core';
import commander from 'commander';
import path from 'path';
import fs from 'fs';
import { HttpServer, IResponseModule } from '@noix/http';
import './modules';
import { BaseModel, GraphQL } from '@noix/engine';
import { buildSchema, graphql, GraphQLSchema } from 'graphql';
@Bootstrap
export class ServerApplication extends SystemApplication {
  private _config: Record<string, unknown> = {};

  private _serverInstance!: HttpServer;
  private _schemes: Record<string, GraphQLSchema> = {};
  public async main() {
    const commandLine = this.ResolveCommandLine();
    if (commandLine.config) {
      this._config = await this.LoadConfigFile(
        path.resolve(process.cwd(), commandLine.config)
      );
    }
    this._serverInstance = new HttpServer(this._config.port as number);
    const systemModule = {
      module: 'system'
    } as IResponseModule;
    systemModule.middlewareHandles = [
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
      },
      async (ctx, next) => {
        console.log(
          'INFO [@noix/server]: ' +
            ctx.request.method +
            ' ' +
            ctx.request.path +
            ' with IP:' +
            ctx.request.ip
        );
        await next();
      }
    ];
    this._serverInstance.RegisterModule(systemModule);
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

  public LoadModule(module: string) {
    const baseModule = {} as IResponseModule;
    baseModule.module = module;
    baseModule.responseHandles = {};
    const classes = BaseModel.GetAllDataModeles(module);
    let str = '';

    const root: Record<string, Function> = {};
    classes.forEach((name) => {
      console.log('INFO [@noix/server] load model ' + name);
      const DataModel = BaseModel.GetDataModel(module, name)!;
      const funs = BaseModel.GetFunctions(DataModel);
      const fields = BaseModel.GetFields(DataModel);
      str += GraphQL.BuildGraphQLScheme(DataModel) + ' ';
      root[name.toLowerCase()] = async () => {
        const init = await DataModel.init();
        const initResponse: Record<string, Function> = {};
        if (init) {
          fields.forEach((field) => {
            initResponse[field.name] = () => Reflect.get(init, field.name);
          });
        }
        funs.forEach((fun) => {
          initResponse[fun.name] = (param: Record<string, unknown>) => {
            const args: unknown[] = [];
            fun.params.forEach((p) => {
              args[p.index!] = param[p.name];
            });
            const handle = Reflect.get(DataModel, fun.name) as Function;
            return handle.apply(DataModel, args);
          };
        });
        return initResponse;
      };
      baseModule.responseHandles![name] = async (req, res) => {
        const graphqlResult = await graphql(
          this._schemes[module],
          req.query.query as string,
          root
        );
        res.body = graphqlResult;
      };
    });
    str += `type Query{
      ${classes.map((c) => `${c.toLowerCase()}:${c}`).join(' ')}
    }`;
    this._schemes[module] = buildSchema(str);
    this._serverInstance.RegisterModule(baseModule);
  }

  public LoadModules() {
    BaseModel.GetAllModule().forEach((module) => this.LoadModule(module));
  }
}
