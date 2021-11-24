import { IColumn } from ".";
import { ITable } from "./ITable";

export interface IDatasource {
  dispose(): void | Promise<void>;
  boot(config: Record<string, unknown>): Promise<void>;
  getTable(param: {
    name: string;
    key: string;
    columns: IColumn[];
  }): Promise<ITable>;
  getTable(param: {
    name: string;
    key?: string;
    columns?: IColumn[];
  }): ITable | undefined;
  create(name: string, key: string, columns: IColumn[]): Promise<void>;
}
export type DatasourceClass = {
  new (...args: unknown[]): IDatasource;
};
