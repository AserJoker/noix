import { SystemApplication, Bootstrap, Logger } from '@noix/core';
import commander from 'commander';
import path from 'path';
import fs from 'fs';
import { HttpServer, IResponseModule } from '@noix/http';
import './modules';
import {
  BaseModel,
  DataSource,
  GraphQL,
  IDataField,
  ITemplateType
} from '@noix/engine';
import { buildSchema, graphql, GraphQLSchema } from 'graphql';
import chalk from 'chalk';
import { MysqlClient } from '@noix/mysql';
import { Field, Function as _Function, Model } from './modules';

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
    Logger.use((source, type) => {
      if (type === 'debug') return chalk.gray(source);
      if (type === 'info') return chalk.blue(source);
      if (type === 'error') return chalk.red(source);
      if (type === 'warn') return chalk.yellow(source);
      return source;
    });
    MysqlClient.ConnectToServer('localhost', 3306, 'admin', 'admin', 'noix');
    await MysqlClient.ResetDatabase();
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
        Logger.Info(
          '@noix/server',
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
    await this.LoadModules();
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

  public async LoadModule(module: string) {
    const baseModule = {} as IResponseModule;
    baseModule.module = module;
    baseModule.responseHandles = {};
    const classes = BaseModel.GetAllDataModeles(module);
    let str = '';

    const root: Record<string, Function> = {};
    await Promise.all(
      classes.map(async (name) => {
        Logger.Info('@noix/server', 'load model ' + name);
        const DataModel = BaseModel.GetDataModel(module, name)!;
        await DataModel.InitDataSource();
        const funs = BaseModel.GetFunctions(DataModel);
        str += GraphQL.BuildGraphQLScheme(DataModel) + ' ';
        root[name.toLowerCase()] = async () => {
          const init = await DataModel.Init();
          const initResponse: Record<string, Function> = {};
          if (init) {
            const resolved = await DataModel.ResolveFields(init);
            Object.keys(resolved).forEach((name) => {
              initResponse[name] = resolved[name];
            });
          }
          funs.forEach((fun) => {
            initResponse[fun.name] = async (param: Record<string, unknown>) => {
              const args: unknown[] = [];
              fun.params.forEach((p) => {
                args[p.index!] = param[p.name];
              });
              const handle = Reflect.get(DataModel, fun.name) as Function;
              const res = await handle.apply(DataModel, args);
              let resolved;
              if (typeof fun.returnType === 'function') {
                resolved = await fun.returnType.ResolveFields(res);
              } else if (fun.returnType === 'this') {
                resolved = await DataModel.ResolveFields(res);
              } else {
                resolved = await DataModel.ResolveFields(
                  res,
                  fun.returnType as ITemplateType
                );
              }
              return resolved;
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
      })
    );
    await Promise.all(
      classes.map(async (name) => {
        const dataModel = BaseModel.GetDataModel(module, name);
        const m = new Model();
        m.module = module;
        m.name = name;
        m.fields = BaseModel.GetFields(dataModel!).map((f) => {
          const field = new Field();
          field.model = name;
          field.array = f.array;
          field.name = f.name;
          field.ref = f.ref || '';
          field.rel = f.ref || '';
          if (typeof f.type === 'string') {
            if (f.type === 'this') {
              field.type = name;
            } else {
              field.type = f.type;
            }
          } else if (typeof f.type === 'function') {
            field.type = f.type.GetModelName();
          } else {
            field.type = name + f.type.name;
          }
          return field;
        });
        m.functions = BaseModel.GetFunctions(dataModel!).map((funmeta) => {
          const fun = new _Function();
          fun.model = name;
          fun.name = funmeta.name;
          fun.params = funmeta.params.map((param) => param.name);
          return fun;
        });
        await Model.Insert(m);
      })
    );
    str += `type Query{
      ${classes.map((c) => `${c.toLowerCase()}:${c}`).join(' ')}
    }`;
    this._schemes[module] = buildSchema(str);
    this._serverInstance.RegisterModule(baseModule);
  }

  public async LoadModules() {
    await Promise.all(
      BaseModel.GetAllModule().map((module) => this.LoadModule(module))
    );
  }
}
