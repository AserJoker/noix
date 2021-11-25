import { FIELD_TYPE, Model } from "..";
import { Metadata } from "./metadata.model";
import { Field as _Field } from "../decorator/field.decorator";
import { Option } from "./option.model";

@Model()
export class Field extends Metadata {
  @_Field({
    type: FIELD_TYPE.ENUM,
    options: [
      FIELD_TYPE.BOOLEAN,
      FIELD_TYPE.ENUM,
      FIELD_TYPE.FLOAT,
      FIELD_TYPE.INTEGER,
      FIELD_TYPE.MANY2MANY,
      FIELD_TYPE.MANY2ONE,
      FIELD_TYPE.ONE2MANY,
      FIELD_TYPE.ONE2ONE,
      FIELD_TYPE.STRING,
      FIELD_TYPE.TEXT,
    ],
  })
  private type: FIELD_TYPE = FIELD_TYPE.STRING;

  @_Field({ type: FIELD_TYPE.BOOLEAN })
  private array: boolean = false;

  @_Field({ type: FIELD_TYPE.STRING })
  private refModel: string = "";

  @_Field({ type: FIELD_TYPE.STRING, array: true })
  private refs: string[] = [];

  @_Field({ type: FIELD_TYPE.STRING, array: true })
  private rels: string[] = [];

  @_Field({
    type: FIELD_TYPE.ONE2MANY,
    refModel: "base.option",
    refs: ["namespace"],
    rels: ["code"],
  })
  private options: Option[] = [];
}
