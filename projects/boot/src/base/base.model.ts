import { Field, FIELD_TYPE, Func, Model, NoixService } from ".";

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

  public fill(record: Record<string, unknown>) {
    Object.assign(this, record);
    return this;
  }

  public constructor(protected service: NoixService) {}
}
