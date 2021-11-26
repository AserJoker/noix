import { Field, FIELD_TYPE, Model, StoreModel } from "@noix/base";

@Model({ store: false, virtual: true })
export class Name extends StoreModel {
  @Field({ type: FIELD_TYPE.STRING })
  private name = "";
  @Field({ type: FIELD_TYPE.STRING })
  private displayName = "";
}
