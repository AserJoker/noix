import { Field, FIELD_TYPE, Model } from "../base";
import { BaseModel } from "../base/base.model";
import { Demo2 } from "./demo2.model";

@Model()
export class Demo extends BaseModel {
  @Field({ type: FIELD_TYPE.STRING })
  protected name = "";

  @Field({
    type: FIELD_TYPE.ONE2MANY,
    refs: ["name"],
    rels: ["name"],
    refModel: "base.demo2",
  })
  protected demo2: Demo2[] = [];

  public async queryOne(record: Record<string, unknown>) {
    return new Demo(this.$service).fill(record);
  }
}
