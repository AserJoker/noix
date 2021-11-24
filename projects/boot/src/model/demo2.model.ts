import { Field, FIELD_TYPE, Model } from "../base";
import { BaseModel } from "../base/base.model";

@Model()
export class Demo2 extends BaseModel {
  @Field({ type: FIELD_TYPE.STRING })
  private name = "";

  @Field({ type: FIELD_TYPE.STRING })
  private value = "";

  public queryOne(record: Record<string, unknown>) {
    return { ...record, value: "value" };
  }
  public queryList(record: Record<string, unknown>) {
    return [{ ...record, value: "value" }];
  }
}
