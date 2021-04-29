import { BaseModel } from '../base';
import { IDataField, IQueryFunction, ITemplateType } from '../types';
export class GraphQL {
  public static BuildGraphQLScheme<T extends typeof BaseModel>(
    ClassObject: T
  ): string {
    const name = ClassObject.GetModelName();
    const fields = BaseModel.GetFields(ClassObject);
    const functions = BaseModel.GetFunctions(ClassObject);
    const scheme = `
    type ${name}{ ${fields
      .map((field) => this.ResolveField(field, ClassObject))
      .join(' ')} ${functions
      .map((fun) => this.ResolveFunction(fun, ClassObject))
      .join(' ')} }
    input Input${name}{ ${fields
      .map((field) => this.ResolveField(field, ClassObject, true))
      .join(' ')} }
    `;
    this.FlatTemplateType(ClassObject);
    const types = this.templateType.get(ClassObject) || [];
    return (
      scheme +
      types
        .map((type) =>
          this.ResolveTemplateType(type as ITemplateType, ClassObject)
        )
        .join(' ')
    );
  }

  private static ResolveField(
    field: IDataField,
    ClassObject: typeof BaseModel,
    input: boolean = false
  ): string {
    if (field.array) {
      return `${field.name}:[${this.ResolveType(
        field.type,
        ClassObject,
        input
      )}]`;
    }
    return `${field.name}:${this.ResolveType(field.type, ClassObject, input)}`;
  }

  private static ResolveFunction(
    fun: IQueryFunction,
    ClassObject: typeof BaseModel
  ): string {
    return `${fun.name}${
      fun.params.length
        ? `(${fun.params
            .map((p) => {
              return this.ResolveField(p, ClassObject, true);
            })
            .join(',')})`
        : ''
    }:${this.ResolveType(fun.returnType, ClassObject)}`;
  }

  private static ResolveType(
    type: string | ITemplateType | typeof BaseModel,
    ClassObject: typeof BaseModel,
    input: boolean = false
  ) {
    if (typeof type === 'string') {
      if (type === 'this') {
        return (input ? 'Input' : '') + ClassObject.GetModelName();
      }
      if (type === 'date') {
        return 'String';
      }
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
    if (typeof type === 'function') {
      return (input ? 'Input' : '') + type.GetModelName();
    }
    if (typeof type === 'object') {
      const types = this.templateType.get(ClassObject) || [];
      if (!types.find((t) => t.name === type.name)) {
        types.push(type);
      }
      this.templateType.set(ClassObject, types);
      return (input ? 'Input' : '') + ClassObject.GetModelName() + type.name;
    }
  }

  private static FlatTemplateType(ClassObject: typeof BaseModel) {
    const ttypes = this.templateType.get(ClassObject) || [];
    ttypes.forEach((type) => {
      type.types.forEach((f) => {
        if (typeof f.type === 'object') {
          const tt = f.type as ITemplateType;
          if (!ttypes.find((t) => t.name === tt.name)) {
            ttypes.push(tt);
          }
        }
      });
    });
    this.templateType.set(ClassObject, ttypes);
  }

  private static ResolveTemplateType(
    type: ITemplateType,
    ClassObject: typeof BaseModel
  ) {
    const tmpClass = (() => {
      return class extends BaseModel {};
    })();
    type.types.forEach((field) => {
      BaseModel.DataField(field)(tmpClass.prototype, field.name!);
    });
    BaseModel.DataModel({
      module: ClassObject.GetModuleName(),
      name: ClassObject.GetModelName() + type.name
    })(tmpClass);
    return `type ${ClassObject.GetModelName()}${type.name} {
       ${type.types
         .map((t) => this.ResolveField(t as IDataField, ClassObject))
         .join(' ')} 
    }
    input Input${ClassObject.GetModelName()}${type.name} {
      ${type.types
        .map((t) => this.ResolveField(t as IDataField, ClassObject, true))
        .join(' ')} 
   }`;
  }

  private static templateType: Map<
    typeof BaseModel,
    ITemplateType[]
  > = new Map();
}
