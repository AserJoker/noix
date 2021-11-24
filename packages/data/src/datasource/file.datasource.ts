import { IDatasource } from "../types";
import { Inject, CURRENT_FACTORY, IFactory, Provide } from "@noix/core";
import fs from "fs";

export const DATASOURCE_FILE = Symbol("datasource.file");
@Provide(DATASOURCE_FILE)
export class FileDatasource implements IDatasource {
  private _rootPath: string = process.cwd();
  public constructor(@Inject(CURRENT_FACTORY) private factory: IFactory) {}
  public dispose() {
    console.log("file dispose");
  }
  public async boot(config: Record<string, unknown>) {
    const { root } = config;
    this._rootPath = (root as string) || this._rootPath;
    if (!fs.existsSync(this._rootPath)) {
      fs.mkdirSync(this._rootPath);
    }
  }
}
