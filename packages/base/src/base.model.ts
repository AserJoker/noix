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
import { PAGE_WRAPPER } from "./wrapper";
@Model({ store: false, virtual: true })
export class BaseModel {
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

  @Func({
    params: ["record", "current", "pageSize"],
    returnType: "$this",
    array: true,
    wrapper: PAGE_WRAPPER,
  })
  public queryPage(
    record: Record<string, unknown>,
    current: number,
    pageSize: number
  ): unknown {
    return {
      current,
      total: 0,
      list: [],
    };
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

  protected get $metadata() {
    const meta = this.getMetadata();
    if (!meta) {
      throw new Error("metadata lost");
    }
    return meta;
  }

  public constructor(
    protected $service: NoixService,
    protected $factory: IFactory,
    ...args: unknown[]
  ) {}
}
