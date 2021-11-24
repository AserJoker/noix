import { ITable, IColumn, IDatasource } from "../types";

export class FileTable implements ITable {
  private _name: string;
  private _key: string;
  private _columns: IColumn[];
  public getName() {
    return this._name;
  }
  public getKey() {
    return this._key;
  }
  public getColumns() {
    return this._columns;
  }
  public constructor(
    name: string,
    key: string,
    columns: IColumn[],
    private $data: IDatasource
  ) {
    this._name = name;
    this._key = key;
    this._columns = columns;
  }
}
