import { Field, FIELD_TYPE, Model } from "@noix/base";
import { Name } from "./name.model";

@Model()
export class Menu extends Name {
  @Field({ type: FIELD_TYPE.STRING })
  private parentCode = "";

  @Field({
    type: FIELD_TYPE.ONE2ONE,
    refModel: "system.menu",
    refs: ["code"],
    rels: ["parentCode"],
  })
  private parent: Menu | null = null;
}
