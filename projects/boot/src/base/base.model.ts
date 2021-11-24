import { CURRENT_FACTORY, getMetadata, IFactory, Inject } from "@noix/core";
import {
  Field,
  FIELD_TYPE,
  Func,
  IField,
  IFunction,
  IMixedModel,
  IModel,
  Model,
  NoixService,
} from ".";

@Model({ store: false, virtual: true })
export class BaseModel {
  @Inject(CURRENT_FACTORY)
  protected $factory!: IFactory;

  @Field({ type: FIELD_TYPE.STRING })
  protected code = "";

  @Func({ params: ["record"], returnType: "$this" })
  public queryOne(record: Record<string, unknown>): unknown {
    return null;
  }

  @Func({ params: ["record"], returnType: "$this" })
  public insertOne(record: Record<string, unknown>): unknown {
    return null;
  }

  @Func({ params: ["record"], returnType: "$this" })
  public updateOne(record: Record<string, unknown>): unknown {
    return null;
  }

  @Func({ params: ["record"], returnType: "$this" })
  public deleteOne(record: Record<string, unknown>): unknown {
    return null;
  }

  @Func({ params: ["record"], returnType: "$this" })
  public insertOrUpdateOne(record: Record<string, unknown>): unknown {
    return null;
  }

  @Func({ params: ["record"], returnType: "$this", array: true })
  public queryList(record: Record<string, unknown>): unknown {
    return [];
  }

  public fill(record: Record<string, unknown>) {
    Object.assign(this, record);
    return this;
  }

  protected getMetadata(): IMixedModel | undefined {
    const classObject = this.constructor;
    const model: IModel = getMetadata(classObject, "base:model");
    const fields: IField[] = getMetadata(classObject, "base:fields") || [];
    const functions: IFunction[] =
      getMetadata(classObject, "base:functions") || [];
    return { ...model, functions, fields };
  }

  public constructor(protected $service: NoixService, ...args: unknown[]) {}
}
