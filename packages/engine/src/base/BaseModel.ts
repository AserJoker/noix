import { EventObject } from '@noix/core';
import { IDataModel, IDataField, IQueryOption } from '../types';
import { IQueryFunction } from '../types/IQueryFunction';

export class BaseModel extends EventObject {
  private static _classes: Record<string, typeof BaseModel> = {};

  private static _functions: Map<
    typeof BaseModel,
    IQueryFunction[]
  > = new Map();

  private static _fields: Map<typeof BaseModel, IDataField[]> = new Map();

  public static DataModel(info: IDataModel) {
    return <T extends typeof BaseModel>(dataModel: T) => {
      BaseModel._classes[info.name] = dataModel;
      const res: IQueryFunction[] = [];
      let tmp = dataModel;
      while (tmp) {
        const parentFunctions = BaseModel._functions.get(tmp) || [];
        parentFunctions.forEach(
          (pf) => !res.find((rf) => rf.name === pf.name) && res.push(pf)
        );
        tmp = Object.getPrototypeOf(tmp);
      }
      const funs = res;
      const arr = funs.map((fun) => ({
        name: fun.name,
        handle: (...args: unknown[]) =>
          (Reflect.get(BaseModel, fun.name) as Function).apply(BaseModel, args)
      }));
      BaseModel._functions.set(BaseModel, arr);
    };
  }

  public static DataField(info: Partial<IDataField>) {
    return <T extends BaseModel>(dataInstance: T, name: string) => {
      const dataModel = dataInstance.GetClassObject<typeof BaseModel>();
      const fieldInfo = BaseModel._fields.get(dataModel) || [];
      const realInfo = info as IDataField;
      realInfo.name = name;
      fieldInfo.push(realInfo);
      BaseModel._fields.set(dataModel, fieldInfo);
    };
  }

  public static QueryFunction() {
    return <T extends typeof BaseModel>(dataModel: T, functionName: string) => {
      const funInfo = BaseModel._functions.get(dataModel) || [];
      const index = funInfo.findIndex((info) => info.name === functionName);
      if (index !== -1) {
        funInfo[index].name = functionName;
      } else {
        funInfo.push({
          name: functionName
        });
      }
      BaseModel._functions.set(dataModel, funInfo);
    };
  }

  public static GetDataModel(name: string) {
    return BaseModel._classes[name];
  }

  public static GetAllDataModeles() {
    return Object.keys(BaseModel._classes);
  }

  public static GetFunctions(dataModel: typeof BaseModel) {
    return BaseModel._functions.get(dataModel);
  }

  public static GetFields(dataModel: typeof BaseModel) {
    const res: IDataField[] = [];
    let tmp = dataModel;
    while (tmp) {
      const parentFields = BaseModel._fields.get(tmp) || [];
      parentFields.forEach(
        (pf) => !res.find((rf) => rf.name === pf.name) && res.push(pf)
      );
      tmp = Object.getPrototypeOf(tmp);
    }
    return res;
  }

  @BaseModel.QueryFunction()
  public static async insert<T extends BaseModel>(record: T): Promise<T> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction()
  public static async update<T extends BaseModel>(record: T): Promise<T> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction()
  public static async delete<T extends BaseModel>(record: T): Promise<T> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction()
  public static async query<T extends BaseModel>(
    queryBody: IQueryOption
  ): Promise<T[]> {
    return [];
  }

  @BaseModel.QueryFunction()
  public static async init<T extends BaseModel>(): Promise<T> {
    return new BaseModel() as T;
  }
}
