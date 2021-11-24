import { NoixFactory } from "./NoixFactory";
import { Boot, IApplication, RequestBody, ResponseBody } from "@noix/mvc";
import { Emit, Hook, Inject } from "@noix/core";
import { DATASOURCE_FILE, IDatasource } from "@noix/data";
import http from "http";
import fs from "fs";
import path from "path";
import { Home } from "./controller/home.controller";
import { Base } from "./module/base.module";
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
