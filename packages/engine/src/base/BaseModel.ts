import { EventObject } from '@noix/core';
import {
  IDataModel,
  IDataField,
  IQueryResult,
  IQueryFunction,
  IQueryParam,
  ITemplateType
} from '../types';

export class BaseModel extends EventObject {
  private static info: IDataModel = { name: '', module: '' };
  private static _classes: Map<
    string,
    Record<string, typeof BaseModel>
  > = new Map();

  private static _functions: Map<
    typeof BaseModel,
    IQueryFunction[]
  > = new Map();

  private static _fields: Map<typeof BaseModel, IDataField[]> = new Map();

  private static _params: Map<
    typeof BaseModel,
    Map<string, IQueryParam<unknown>[]>
  > = new Map();

  public static DataModel(info: IDataModel) {
    return <T extends typeof BaseModel>(dataModel: T) => {
      const classes = BaseModel._classes.get(info.module) || {};
      classes[info.name] = dataModel;
      const res: IQueryFunction[] = [];
      const resFields: IDataField[] = [];
      let tmp = dataModel;
      while (tmp) {
        const parentFunctions = BaseModel._functions.get(tmp) || [];
        const parentFields = BaseModel._fields.get(tmp) || [];
        parentFunctions.forEach(
          (pf) => !res.find((rf) => rf.name === pf.name) && res.push(pf)
        );
        parentFields.forEach(
          (field) =>
            !resFields.find((rf) => rf.name === field.name) &&
            resFields.push(field)
        );
        tmp = Object.getPrototypeOf(tmp);
      }
      const funs = res;
      const arr = funs.map((fun) => ({
        name: fun.name,
        handle: (...args: unknown[]) =>
          (Reflect.get(dataModel, fun.name) as Function).apply(dataModel, args),
        params: fun.params,
        returnType: fun.returnType
      }));
      BaseModel._functions.set(dataModel, arr);
      BaseModel._fields.set(dataModel, resFields);
      BaseModel._classes.set(info.module, classes);
      dataModel.info = info;
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

  public static QueryFunction(info: string | ITemplateType) {
    return <T extends typeof BaseModel>(dataModel: T, functionName: string) => {
      const funInfo = BaseModel._functions.get(dataModel) || [];
      const index = funInfo.findIndex((info) => info.name === functionName);
      if (index === -1) {
        const funs =
          BaseModel._params.get(dataModel) ||
          new Map<string, IQueryParam<unknown>[]>();
        const params = funs.get(functionName) || [];
        funInfo.push({
          name: functionName,
          params,
          returnType: info
        });
      }
      BaseModel._functions.set(dataModel, funInfo);
    };
  }

  public static QueryParam<P>(
    info: Partial<IQueryParam<P>> & { type: string; name: string }
  ) {
    return <T extends typeof BaseModel>(
      target: T,
      name: string,
      index: number
    ) => {
      const funs =
        BaseModel._params.get(target) ||
        new Map<string, IQueryParam<unknown>[]>();
      const params = funs.get(name) || [];
      params.push({
        ...info,
        index,
        array: info.array || false,
        name: info.name,
        type: info.type
      });
      funs.set(name, params);
      BaseModel._params.set(target, funs);
    };
  }

  public static GetDataModel(module: string, name: string) {
    const classes = BaseModel._classes.get(module);
    return classes && classes[name];
  }

  public static GetAllDataModeles(module: string) {
    return Object.keys(BaseModel._classes.get(module) || {});
  }

  public static GetFunctions(dataModel: typeof BaseModel) {
    return BaseModel._functions.get(dataModel) || [];
  }

  public static GetFields(dataModel: typeof BaseModel) {
    return BaseModel._fields.get(dataModel) || [];
  }

  public static GetParams(dataModel: typeof BaseModel, funName: string) {}

  @BaseModel.QueryFunction('this')
  public static async insert<T extends BaseModel>(
    @BaseModel.QueryParam({ name: 'record', type: 'this' })
    record: T
  ): Promise<BaseModel> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction('this')
  public static async update<T extends BaseModel>(
    @BaseModel.QueryParam({ name: 'record', type: 'this' }) record: T
  ): Promise<BaseModel> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction('this')
  public static async delete<T extends BaseModel>(
    @BaseModel.QueryParam({ name: 'record', type: 'this' }) record: T
  ): Promise<BaseModel> {
    return new BaseModel() as T;
  }

  @BaseModel.QueryFunction('this')
  public static async query<T extends BaseModel>(
    @BaseModel.QueryParam({ name: 'record', type: 'this' }) record: T,
    parent: BaseModel,
    root: BaseModel
  ): Promise<BaseModel | null> {
    return null;
  }

  @BaseModel.QueryFunction({
    name: 'QueryResult',
    types: [
      { name: 'size', type: 'int' },
      { name: 'page', type: 'int' },
      { name: 'total', type: 'int' },
      { name: 'list', type: 'this', array: true }
    ]
  } as ITemplateType)
  public static async queryList(
    @BaseModel.QueryParam({ name: 'size', type: 'int' }) size: number,
    @BaseModel.QueryParam({ name: 'page', type: 'int' }) page: number,
    @BaseModel.QueryParam({ name: 'condition', type: 'string' })
    condition: string,
    parent: BaseModel,
    root: BaseModel
  ): Promise<IQueryResult<BaseModel>> {
    return {
      size: 0,
      page: 1,
      total: 0,
      list: []
    };
  }

  public static async init(): Promise<BaseModel> {
    return new BaseModel();
  }

  public static GetModelName() {
    return this.info.name;
  }

  public static GetAllModule() {
    const result: string[] = [];
    BaseModel._classes.forEach((c, module) => result.push(module));
    return result;
  }
}
