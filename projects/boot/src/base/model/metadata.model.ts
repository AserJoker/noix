import { Field, FIELD_TYPE, Model } from "..";
import { StoreModel } from "../store.model";

@Model({ virtual: true, store: false })
export class Metadata extends StoreModel {
  @Field({ type: FIELD_TYPE.STRING })
  private namespace = "";
  @Field({ type: FIELD_TYPE.STRING })
  private name = "";
  @Field({ type: FIELD_TYPE.STRING })
  private displayName = "";

  public async insertOne(record: Record<string, unknown>) {
    const code = `${record.namespace}.${record.name}`;
    return super.insertOne({ ...record, code });
  }
}
