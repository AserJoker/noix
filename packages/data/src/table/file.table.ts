import { ITable, IColumn, IDatasource } from "../types";
import { Lisp } from "@noix/lisp";
import fs from "fs";

export class FileTable implements ITable {
  private _name: string;
  private _key: string;
  private _columns: IColumn[];
  private _tasks: { resolve: () => void; reject: (error: Error) => void }[] =
    [];
  private _busy: boolean = false;

  public getName() {
    return this._name;
  }

  public getKey() {
    return this._key;
  }

  public getColumns() {
    return this._columns;
  }

  private resolveRecordToLisp(record: Record<string, unknown>) {
    const conditions: string[] = [];
    this._columns
      .filter((col) => record[col.name] !== undefined)
      .forEach((col) => {
        let value = record[col.name];
        if (typeof value === "string") {
          value = `"${value}"`;
        }
        conditions.push(`(eq ${col.name} ${value})`);
      });
    return conditions.reduce((last, now) => {
      return `(and ${last} ${now})`;
    });
  }

  public async read(): Promise<Record<string, unknown>[]> {
    const source = fs.readFileSync(this.path).toString();
    const table = JSON.parse(source);
    return table.data || [];
  }

  public async write(data: Record<string, unknown>[]) {
    const { _name: name, _key: key, _columns: columns } = this;
    const table = { name, key, columns, data };
    fs.writeFileSync(this.path, JSON.stringify(table));
  }

  public async query<T>(queryLisp: T) {
    return null;
  }

  public async count() {
    const list = await this.read();
    return list.length;
  }

  public async select<T>(record: Record<string, unknown>) {
    const list = await this.read();
    const result = list
      .filter((item) => {
        const lisp = this.resolveRecordToLisp(record);
        return Lisp.eval(lisp, item);
      })
      .map((item) => {
        const _record: Record<string, unknown> = {};
        this._columns
          .filter((col) => item[col.name] !== undefined)
          .forEach((col) => {
            if (col.serialize === "json") {
              _record[col.name] = JSON.parse(item[col.name] as string);
            } else {
              _record[col.name] = item[col.name];
            }
          });
        return _record;
      }) as T[];
    return result;
  }

  public async insert<T>(record: Record<string, unknown>) {
    const _record: Record<string, unknown> = {};
    this._columns
      .filter((col) => record[col.name] !== undefined)
      .forEach((col) => {
        if (col.serialize === "json") {
          _record[col.name] = JSON.stringify(record[col.name]);
        } else {
          _record[col.name] = record[col.name];
        }
      });
    const key = this._columns.find((col) => col.name == this._key) as IColumn;
    if (!key._increase_counter) {
      key._increase_counter = 0;
    }
    _record[key.name] = ++key._increase_counter;
    const list = await this.read();
    list.push(_record);
    await this.write(list);
    return _record as T;
  }

  public async update<T>(record: Record<string, unknown>) {
    const _record: Record<string, unknown> = {};
    this._columns
      .filter((col) => record[col.name] !== undefined)
      .forEach((col) => {
        if (col.serialize === "json") {
          _record[col.name] = JSON.stringify(record[col.name]);
        } else {
          _record[col.name] = record[col.name];
        }
      });
    const key = this._columns.find((col) => col.name == this._key) as IColumn;
    if (!_record[key.name]) {
      return null;
    }
    const list = await this.read();
    const index = list.findIndex((item) => item[key.name] == _record[key.name]);
    if (index !== -1) {
      list[index] = _record;
      await this.write(list);
      return _record as T;
    }
    return null;
  }

  public async delete<T>(record: Record<string, unknown>) {
    const _record: Record<string, unknown> = {};
    this._columns
      .filter((col) => record[col.name] !== undefined)
      .forEach((col) => {
        if (col.serialize === "json") {
          _record[col.name] = JSON.stringify(record[col.name]);
        } else {
          _record[col.name] = record[col.name];
        }
      });
    const key = this._columns.find((col) => col.name == this._key) as IColumn;
    if (!_record[key.name]) {
      return null;
    }
    const list = await this.read();
    const index = list.findIndex((item) => {
      return Lisp.eval(this.resolveRecordToLisp(_record), item);
    });
    if (index !== -1) {
      list.splice(index, 1);
      await this.write(list);
      return _record as T;
    }
    return null;
  }

  public constructor(
    name: string,
    key: string,
    columns: IColumn[],
    private path: string,
    private $data: IDatasource
  ) {
    this._name = name;
    this._key = key;
    this._columns = columns;
  }

  public async lock() {
    if (this._busy) {
      return new Promise<void>((resolve, reject) =>
        this._tasks.push({ resolve, reject })
      );
    } else {
      this._busy = true;
    }
  }

  public async unlock() {
    if (this._tasks.length) {
      const last = this._tasks.shift();
      if (last) {
        last.resolve();
      }
    }
    if (!this._tasks.length) {
      this._busy = false;
    }
  }
}
