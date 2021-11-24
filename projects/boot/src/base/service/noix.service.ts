import { getMetadata, IFactory } from "@noix/core";
import { IResolver, ISchema, ResolveHandle, useResolver } from "@noix/resolve";
import { FIELD_TYPE, IComplexField, IField, IFunction } from "..";
import { IModel } from "../types/IModel";

export class NoixService {
  private static _services = new Map<string, NoixService>();

  private _resolver: ResolveHandle;

  private _models: Function[];

  private _model_resolvers: Record<string, Function> = {};

  public async run(schema: ISchema, context: Record<string, unknown> = {}) {
    return this._resolver(schema, context);
  }

  public constructor(
    module: string,
    models: Function[],
    private factory: IFactory
  ) {
    this._models = models;
    this.resolveMetadata(module);
    const root: IResolver = {};
    models.forEach((model) => {
      const meta: IModel = getMetadata(model, "base:model") as IModel;
      this.createRecordResolver(meta, model);
      if (meta.virtual !== true) {
        root[meta.name] = this.resolveModel(meta, model);
      }
    });
    this._resolver = useResolver(root);
    NoixService._services.set(module, this);
  }

  protected resolveModel(meta: IModel, classObject: Function) {
    const model_handles: Record<string, Function> = {};
    const functions: IFunction[] =
      getMetadata(classObject, "base:functions") || [];
    functions.forEach((fun) => {
      model_handles[fun.name] = this.resolveFunction(fun, classObject);
    });
    return () => model_handles;
  }

  protected resolveFunction(meta: IFunction, classObject: Function) {
    return async (...args: unknown[]) => {
      const [ctx, param] = args as [
        Record<string, unknown>,
        Record<string, unknown>
      ];
      const params = meta.params.map((name) => param[name]);
      params.push(ctx.context);
      return this.resolveFunctionCall(classObject, meta, params);
    };
  }

  protected async resolveFunctionCall(
    name: string | Function,
    funName: string | IFunction,
    params: unknown[]
  ) {
    const classObject =
      typeof name === "function"
        ? name
        : this._models.find((model) => {
            const meta: IModel = getMetadata(model, "base:model");
            return meta?.name === name;
          });
    if (classObject) {
      const funs: IFunction[] =
        getMetadata(classObject, "base:functions") || [];
      const fun =
        typeof funName === "object"
          ? funName
          : funs.find((meta) => meta.name === funName);
      if (fun) {
        const result = await this.call(classObject, fun, params);
        if (result === undefined || result === null || !fun.returnType) {
          return result;
        } else {
          const refModel =
            fun.returnType === "$this" ? fun.namespace : fun.returnType;
          if (fun.array) {
            return this.resolveArray(
              result as Record<string, unknown>[],
              refModel
            );
          } else {
            return this.resolveRecord(
              result as Record<string, unknown>,
              refModel
            );
          }
        }
      }
    }
  }

  protected resolveArray(
    records: Record<string, unknown>[],
    modelName: string
  ) {
    return records.map((record) => this.resolveRecord(record, modelName));
  }

  protected resolveRecord(record: Record<string, unknown>, modelName: string) {
    const [module, name] = modelName.split(".");
    const service = NoixService._services.get(module);
    if (service) {
      const resolver = service.getModelResolver(name);
      return resolver(record) as Record<string, Function>;
    }
  }

  protected resolveMetadata(module: string) {
    this._models.forEach((model) => {
      const model_meta: IModel = getMetadata(model, "base:model");
      model_meta.namespace = module;
      model_meta.name = model.name.toLowerCase();
      model_meta.code = `${module}.${model_meta.name}`;
      if (model_meta) {
        const function_metas: IFunction[] =
          getMetadata(model, "base:functions") || [];
        const field_metas: IField[] = getMetadata(model, "base:fields") || [];
        function_metas.forEach((fun) => {
          fun.namespace = model_meta.code;
          fun.code = `${fun.namespace}.${fun.name}`;
        });
        field_metas.forEach((field) => {
          field.namespace = model_meta.code;
          field.code = `${field.namespace}.${field.name}`;
        });
      }
    });
  }

  protected getModelResolver(name: string) {
    return this._model_resolvers[name];
  }

  protected createRecordResolver(meta: IModel, classObject: Function) {
    const fields: IField[] = getMetadata(classObject, "base:fields");
    this._model_resolvers[meta.name] = (record: Record<string, unknown>) => {
      return new Proxy(
        {},
        {
          get: (target, name: string) => {
            const field = fields.find((f) => f.name === name) as IField;
            if (!field) {
              return undefined; //处理异步key 【then,cache...] 辨别PromiseLike与Proxy的区别
            }
            switch (field.type) {
              case FIELD_TYPE.ONE2MANY:
                return ({ context }: Record<string, unknown>) =>
                  this.resolveOne2Many(record, field as IComplexField, context);
              case FIELD_TYPE.MANY2ONE:
                return ({ context }: Record<string, unknown>) =>
                  this.resolveMany2One(record, field as IComplexField, context);
              case FIELD_TYPE.ONE2ONE:
                return ({ context }: Record<string, unknown>) =>
                  this.resolveOne2One(record, field as IComplexField, context);
              case FIELD_TYPE.MANY2MANY:
                return ({ context }: Record<string, unknown>) =>
                  this.resolveMany2Many(
                    record,
                    field as IComplexField,
                    context
                  );
              default:
                return () => record[name] || null;
            }
          },
        }
      );
    };
  }

  protected resolveRelation(
    record: Record<string, unknown>,
    field: IComplexField
  ) {
    const result: Record<string, unknown> = {};
    field.refs.forEach((ref, index) => {
      const rel = field.rels[index];
      result[ref] = record[rel];
    });
    return result;
  }

  protected resolveMany2One(
    record: Record<string, unknown>,
    field: IComplexField,
    context: unknown
  ) {
    const relation = this.resolveRelation(record, field);
    const refModel = field.refModel;
    const [module, name] = refModel.split(".");
    const service = NoixService._services.get(module);
    if (service) {
      return service.resolveFunctionCall(name, "queryOne", [relation, context]);
    }
  }

  protected resolveOne2Many(
    record: Record<string, unknown>,
    field: IComplexField,
    context: unknown
  ) {
    const relation = this.resolveRelation(record, field);
    const refModel = field.refModel;
    const [module, name] = refModel.split(".");
    const service = NoixService._services.get(module);
    if (service) {
      return service.resolveFunctionCall(name, "queryList", [
        relation,
        context,
      ]);
    }
  }

  protected async resolveOne2One(
    record: Record<string, unknown>,
    field: IComplexField,
    context: unknown
  ) {
    const relRelation: Record<string, unknown> = {};
    const relModel = field.namespace;
    const [relModule, relName] = relModel.split(".");
    field.rels.forEach((rel) => {
      relRelation[`${relName}_${rel}`] = record[rel];
    });
    const [refModule, refName] = field.refModel.split(".");
    const relationModel = `${relModule}.${relName}_${refName}`;
    const relation = await this.call<Record<string, unknown>>(
      relationModel,
      "queryOne",
      [relRelation, context]
    );
    if (!relation) {
      return null;
    }
    const refRelation: Record<string, unknown> = {};
    field.refs.forEach((ref) => {
      refRelation[ref] = relation[`${refName}_${ref}`];
    });
    const service = NoixService._services.get(refModule);
    if (service) {
      return service.resolveFunctionCall(refName, "queryOne", [
        refRelation,
        context,
      ]);
    }
    return null;
  }

  protected async resolveMany2Many(
    record: Record<string, unknown>,
    field: IComplexField,
    context: unknown
  ) {
    const relRelation: Record<string, unknown> = {};
    const relModel = field.namespace;
    const [relModule, relName] = relModel.split(".");
    field.rels.forEach((rel) => {
      relRelation[`${relName}_${rel}`] = record[rel];
    });
    const [refModule, refName] = field.refModel.split(".");
    const relationModel = `${relModule}.${relName}_${refName}`;
    const relations = await this.call<Record<string, unknown>[]>(
      relationModel,
      "queryOne",
      [relRelation, context]
    );
    if (!relations) {
      return [];
    }
    const service = NoixService._services.get(refModule);
    return relations.map((relation) => {
      const refRelation: Record<string, unknown> = {};
      field.refs.forEach((ref) => {
        refRelation[ref] = relation[`${refName}_${ref}`];
      });
      if (service) {
        return service.resolveFunctionCall(refName, "queryOne", [
          refRelation,
          context,
        ]);
      }
      return [];
    });
  }

  public async call<T>(
    modelName: string | Function,
    funName: string | IFunction,
    params: unknown[]
  ) {
    const classObject =
      typeof modelName === "function"
        ? modelName
        : this._models.find((m) => {
            const meta: IModel | undefined = getMetadata(m, "base:model");
            if (meta) {
              return meta.name === modelName;
            }
          });
    if (classObject) {
      const ins = this.factory.createInstance(classObject, [this]) as Object;
      const handle: Function = Reflect.get(
        ins,
        typeof funName === "object" ? funName.name : funName
      );
      return handle.call(ins, ...params) as T;
    }
  }

  public getMetadata() {
    const fields: IField[] = [];
    const functions: IFunction[] = [];
    const models = this._models
      .map((classObject) => {
        fields.push(
          ...((getMetadata(classObject, "base:fields") as IField[]) || [])
        );
        functions.push(
          ...((getMetadata(classObject, "base:functions") as IFunction[]) || [])
        );
        return getMetadata(classObject, "base:model");
      })
      .filter((m) => !!m) as IModel[];
    return { fields, functions, models };
  }
  public static getMetadata() {
    const _models: IModel[] = [];
    const _fields: IField[] = [];
    const _functions: IFunction[] = [];
    NoixService._services.forEach((service) => {
      const { models, fields, functions } = service.getMetadata();
      _models.push(...models);
      _fields.push(...fields);
      _functions.push(...functions);
    });
    return { models: _models, fields: _fields, functions: _functions };
  }
  public static select(module: string) {
    return NoixService._services.get(module);
  }
}
