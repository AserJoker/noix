import { EventObject, Logger } from '@noix/core';
import { BaseModel } from '../base';
import { MysqlClient } from '@noix/mysql';
import { IDataField } from '../types';
import { NoixQLisp } from '@noix/dsl';
export class DataSource extends EventObject {
  private _model: typeof BaseModel;
  public constructor(model: typeof BaseModel) {
    super();
    this._model = model;
  }
  public get model() {
    return this._model;
  }

  public async Exec<T extends Record<string, unknown>>(
    sql: string
  ): Promise<T | null> {
    return null;
  }
  public async Insert<T>(record: T): Promise<T> {
    const tableName = (
      this.model.GetModuleName() +
      '_' +
      this.model.GetModelName()
    ).toLowerCase();
    const kvMap = record as Record<string, unknown>;
    kvMap.createDate = Date.now();
    kvMap.updateDate = Date.now();
    const fields = BaseModel.GetFields(this.model).filter(
      (f) => typeof f.type === 'string' && f.type !== 'this' && kvMap[f.name]
    );
    const sql = `INSERT INTO ${tableName} (${fields
      .map((f) => f.name)
      .join(',')}) VALUES (${fields
      .map((f) => DataSource.ResolveValue(kvMap[f.name], f))
      .join(',')});`;
    Logger.Debug('@noix/engine', sql);
    const res = (await MysqlClient.Query(sql)) as Record<string, unknown>;
    const pamiryKey = this.model.GetPamiryKey()!;
    await Promise.all(
      BaseModel.GetFields(this.model).map(async (f) => {
        const type = f.type;
        if (typeof type === 'function' && type.GetPamiryKey()) {
          const value = Reflect.get(record as Record<string, unknown>, f.name);
          if (value) {
            const fieldPamiryKey = type.GetPamiryKey();
            if (Array.isArray(value)) {
              await Promise.all(
                value.map(async (v) => {
                  const res = await type.InsertOrUpdate(v);
                  v[fieldPamiryKey] = Reflect.get(res, fieldPamiryKey);
                })
              );
            } else {
              const res = await type.InsertOrUpdate(value);
              value[fieldPamiryKey] = Reflect.get(res, fieldPamiryKey);
            }
          }
        }
      })
    );
    return { ...record, [pamiryKey]: res.insertId } as T;
  }
  public async Update<T>(record: T): Promise<T> {
    const tableName = (
      this.model.GetModuleName() +
      '_' +
      this.model.GetModelName()
    ).toLowerCase();
    const kvMap = record as Record<string, unknown>;
    kvMap.updateDate = Date.now();
    const pamiryKey = this.model.GetPamiryKey()!;
    const pamiryValue = kvMap[pamiryKey];
    const modelFields = BaseModel.GetFields(this.model);
    const simpleFields: IDataField[] = [];
    const clearFields: IDataField[] = [];
    const complexFields: IDataField[] = [];
    const recordkeys = Object.keys(record);
    modelFields.forEach((mf) => {
      if (recordkeys.includes(mf.name)) {
        if (kvMap[mf.name] === null) {
          clearFields.push(mf);
        } else {
          if (typeof mf.type === 'function') {
            complexFields.push(mf);
          }
          if (typeof mf.type === 'string') {
            simpleFields.push(mf);
          }
        }
      }
    });
    const sql = `UPDATE ${tableName} SET ${clearFields
      .map((f) => `${f.name}=NULL`)
      .join(',')} ${simpleFields.map(
      (f) => `${f.name}=${DataSource.ResolveValue(kvMap[f.name], f)}`
    )} WHERE ${pamiryKey}=${pamiryValue}`;
    await MysqlClient.Query(sql);
    await Promise.all(
      complexFields.map(async (f) => {
        const value = kvMap[f.name] as BaseModel | BaseModel[];
        const type = f.type;
        if (typeof type === 'function') {
          if (Array.isArray(value)) {
            await Promise.all(
              value.map(async (v) => {
                await type.InsertOrUpdate(v);
              })
            );
          } else {
            await type.InsertOrUpdate(value);
          }
        }
      })
    );
    return record;
  }
  public async Delete<T>(record: T): Promise<T> {
    return record;
  }

  public async InsertOrUpdate<T>(record: T): Promise<T> {
    const pamiryKey = this.model.GetPamiryKey()!;
    if (Reflect.get(record as Record<string, unknown>, pamiryKey)) {
      return this.Update(record);
    } else {
      return this.Insert(record);
    }
  }

  public async Query<T>(
    queryLisp: string,
    offset: number,
    limit: number
  ): Promise<T[]> {
    const tableName = (
      this.model.GetModuleName() +
      '_' +
      this.model.GetModelName()
    ).toLowerCase();
    const sql = `SELECT * from ${tableName} ${
      queryLisp !== ''
        ? 'WHERE ' + NoixQLisp.ToSQL(NoixQLisp.Compile(queryLisp))
        : ''
    } `;
    const res = (await MysqlClient.Query(sql)) as Record<string, unknown>[];
    const arrfields = BaseModel.GetFields(this.model).filter(
      (f) => typeof f.type === 'string' && f.type !== 'this' && f.array
    );
    res.forEach((r) => {
      Object.keys(r).forEach((name) => {
        if (arrfields.find((af) => af.name === name)) {
          r[name] = JSON.parse(r[name] as string);
        }
      });
    });
    const complexFields = BaseModel.GetFields(this.model).filter(
      (mf) =>
        (typeof mf.type === 'function' && mf.type.GetPamiryKey()) ||
        mf.type === 'this'
    );
    await Promise.all(
      res.map(async (r) => {
        await Promise.all(
          complexFields.map(async (cf) => {
            const type = typeof cf.type === 'function' ? cf.type : this.model;
            r[cf.name] = await type.QueryByRelation(cf, r[cf.rel!]);
          })
        );
      })
    );
    return res as T[];
  }

  public static async CreateTable(model: typeof BaseModel): Promise<void> {
    const tableName = (
      model.GetModuleName() +
      '_' +
      model.GetModelName()
    ).toLowerCase();
    const fields = BaseModel.GetFields(model);
    const pamiryKey = model.GetPamiryKey();
    const sql = `CREATE TABLE ${tableName} (${fields
      .filter((f) => typeof f.type === 'string' && f.type !== 'this')
      .map((f) => {
        let type = f.array
          ? 'VARCHAR(1024)'
          : DataSource.MapType(f.type as string);
        if (f.name === pamiryKey) {
          return `${f.name} ${type} NOT NULL PRIMARY KEY AUTO_INCREMENT`;
        }
        return `${f.name} ${type}`;
      })
      .join(',')})`;
    Logger.Debug('@noix/engine', sql);
    await MysqlClient.Query(sql);
  }

  protected static MapType(fieldType: string) {
    let type = fieldType;
    switch (fieldType) {
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
      case 'date':
        type = 'VARCHAR(255)';
        break;
    }
    return type;
  }
  protected static ResolveValue(value: unknown, field: IDataField) {
    if (!value) {
      return null;
    }
    if (field.array) {
      return `"${JSON.stringify(value).replace(/\"/g, '\\"')}"`;
    }
    switch (field.type) {
      case 'boolean':
        return value ? 1 : 0;
      case 'text':
      case 'date':
      case 'string':
        return `"${value}"`;
      case 'int':
      case 'float':
        return `${value}`;
    }
  }
}
