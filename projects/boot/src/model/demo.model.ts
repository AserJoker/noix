import { Field, FIELD_TYPE, Model } from "../base";
import { StoreModel } from "../base/store.model";
import { Demo2 } from "./demo2.model";

@Model()
export class Demo extends StoreModel {
  @Field({ type: FIELD_TYPE.STRING })
  protected name = "";

  @Field({
    type: FIELD_TYPE.ONE2MANY,
    refs: ["name"],
    rels: ["name"],
    refModel: "base.demo2",
  })
  protected demo2: Demo2[] = [];
}
