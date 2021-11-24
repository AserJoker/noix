import { NoixFactory } from "./NoixFactory";
import { Boot, IApplication, RequestBody, ResponseBody } from "@noix/mvc";
import { Emit, Hook, Inject } from "@noix/core";
import { DATASOURCE_FILE, IDatasource } from "@noix/data";
import http from "http";
import fs from "fs";
import path from "path";
import { Home } from "./controller/home.controller";
import { Base } from "./module/base.module";
import { FIELD_TYPE, IEnumField, ISimpleField, NoixService } from "./base";
@Boot({ controllers: [Home, Base], factory: NoixFactory.theFactory })
@RequestBody
@ResponseBody
export class Application implements IApplication {
  private _config: Record<string, Record<string, unknown>> = {};
  public constructor(@Inject(DATASOURCE_FILE) private datasource: IDatasource) {
    try {
      const config = fs
        .readFileSync(path.resolve(process.cwd(), "noix.config.json"))
        .toString();
      this._config = JSON.parse(config);
    } catch (e) {
      console.log("[ERROR]:cannot load config file");
      this._config = {};
    }
  }
  public getConfig(name: string) {
    return this._config[name] || {};
  }
  @Hook(async function (this: Application, args, next) {
    await this.datasource.boot(this.getConfig("data"));
    await Promise.all(
      NoixService.getMetadata()
        .filter((model) => model.store !== false)
        .map(async (model) => {
          await this.datasource.getTable({
            name: `${model.namespace}_${model.name}`,
            key: model.key || "code",
            columns: model.fields
              .filter(
                (f) =>
                  f.type !== FIELD_TYPE.MANY2MANY &&
                  f.type !== FIELD_TYPE.MANY2ONE &&
                  f.type !== FIELD_TYPE.ONE2MANY &&
                  f.type !== FIELD_TYPE.ONE2ONE
              )
              .map((field) => {
                const simpleField = field as ISimpleField | IEnumField;
                const { type: fieldType } = simpleField;
                let type: string = "NULL";
                switch (fieldType) {
                  case FIELD_TYPE.BOOLEAN:
                    type = "TINYINT";
                    break;
                  case FIELD_TYPE.ENUM:
                  case FIELD_TYPE.STRING:
                    type = "VARCHAR(1024)";
                    break;
                  case FIELD_TYPE.INTEGER:
                    type = "INTEGER";
                    break;
                  case FIELD_TYPE.FLOAT:
                    type = "FLOAT";
                    break;
                  case FIELD_TYPE.TEXT:
                    type = "LONGTEXT";
                    break;
                }
                return {
                  name: field.name,
                  unique:
                    field.name === "id" ||
                    field.name === "code" ||
                    field.name === model.key,
                  auto_increase: field.name === "id",
                  type,
                };
              }),
          });
        })
    );
    return next();
  })
  public async boot(server: http.Server) {
    let _address: string = "";
    const address = server.address();
    if (address) {
      if (typeof address === "string") {
        _address = address;
      } else {
        _address = address.address + ":" + address.port;
      }
    }
    console.log(`noix server is running @ http://${_address}`);
  }

  public async emit(event: "init", name: string): Promise<void>;
  public async emit(event: "postinit"): Promise<void>;
  @Emit
  public async emit(event: string, ...args: unknown[]) {}
}
