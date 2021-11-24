import { Field, FIELD_TYPE, Model } from "..";
import { Metadata } from "./metadata.model";

@Model()
export class Function extends Metadata {
  @Field({ type: FIELD_TYPE.STRING, array: true })
  private params: string[] = [];

  @Field({ type: FIELD_TYPE.STRING })
  private returnType = "";

  @Field({ type: FIELD_TYPE.BOOLEAN })
  private array = false;
}
