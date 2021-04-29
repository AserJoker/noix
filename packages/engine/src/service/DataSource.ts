import { EventObject, Logger } from '@noix/core';
import { BaseModel } from '../base';
import { NoixQLisp, NoixQLispNode } from '@noix/dsl';
import { MysqlClient } from '@noix/mysql';
export class DataSource extends EventObject {
  private _model: typeof BaseModel;
  public constructor(model: typeof BaseModel) {
    super();
    this._model = model;
  }
  public get model() {
    return this._model;
  }
  public async Exec<T>(sql: string): Promise<T | null> {
    return null;
  }
  public async Insert<T>(record: T): Promise<T> {
    return record;
  }
  public async Update<T>(record: T): Promise<T> {
    return record;
  }
  public async Delete<T>(record: T): Promise<T> {
    return record;
  }

  public async Query<T>(
    queryLisp: string,
    offset: number,
    limit: number
  ): Promise<T[]> {
    return [];
  }

  public static async CreateTable(model: typeof BaseModel): Promise<void> {
    const tableName = (
      model.GetModuleName() +
      '_' +
      model.GetModelName()
    ).toLowerCase();
    const fields = BaseModel.GetFields(model);
    const sql = `CREATE TABLE ${tableName} (${fields
      .filter((f) => typeof f.type === 'string' && f.type !== 'this')
      .map((f) => {
        let type = '';
        switch (f.type) {
          case 'string':
            type = 'VARCHAR(1024)';
            break;
          case 'float':
            type = 'FLOAT';
            break;
          case 'int':
            type = 'INT';
            break;
          case 'boolean':
            type = 'TINYINT';
            break;
          case 'text':
            type = 'TEXT';
            break;
        }
        return `${f.name} ${type}`;
      })
      .join(',')})`;
    Logger.Debug('@noix/engine', sql);
    await MysqlClient.Query(sql);
  }
}
