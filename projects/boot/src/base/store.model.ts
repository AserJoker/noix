import { Field, FIELD_TYPE, Model } from ".";
import { BaseModel } from "./base.model";

@Model({ store: false, virtual: true })
export class StoreModel extends BaseModel {
  @Field({ type: FIELD_TYPE.INTEGER })
  private id = 0;
  public queryOne(record: Record<string, unknown>) {
    return record;
  }
}
