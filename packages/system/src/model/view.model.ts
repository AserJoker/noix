import { Field, FIELD_TYPE, Model, StoreModel } from "@noix/base";
import { Name } from "./name.model";
@Model({ displayName: "视图" })
export class View extends Name {
  @Field({ type: FIELD_TYPE.TEXT })
  private xml: string = "";
}
