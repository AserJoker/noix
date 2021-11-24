import { IColumn } from "./IColumn";

export interface ITable {
  getKey(): string;
  getName(): string;
  getColumns(): IColumn[];
}
