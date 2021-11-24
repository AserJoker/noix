import { IColumn, IDatasource, ITable } from "../types";
import { Inject, CURRENT_FACTORY, IFactory, Provide } from "@noix/core";
import fs from "fs";
import path from "path";
import { FileTable } from "../table/file.table";

export const DATASOURCE_FILE = Symbol("datasource.file");
@Provide(DATASOURCE_FILE)
export class FileDatasource implements IDatasource {
  private _rootPath: string = process.cwd();
  private _tables = new Map<string, ITable>();
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
  public getTable(param: {
    name: string;
    key: string;
    columns: IColumn[];
  }): Promise<ITable>;
  public getTable(param: {
    name: string;
    key?: string;
    columns?: IColumn[];
  }): ITable | undefined;
  public getTable(param: { name: string; key?: string; columns?: IColumn[] }) {
    const cache = this._tables.get(param.name);
    if (cache) {
      return cache;
    }
    if (!param.key || !param.columns) {
      return undefined;
    }
    return new Promise<ITable>((resolve) => {
      const table = new FileTable(
        param.name,
        param.key as string,
        param.columns as IColumn[],
        this
      );
      this._tables.set(param.name, table);
      this.create(
        param.name,
        param.key as string,
        param.columns as IColumn[]
      ).then(() => resolve(table));
    });
  }
  public async create(name: string, key: string, columns: IColumn[]) {
    const table = { name, key, columns, data: [] };
    fs.writeFileSync(
      path.resolve(this._rootPath, name + ".json"),
      JSON.stringify(table)
    );
  }
}
