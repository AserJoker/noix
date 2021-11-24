import { Model as _Model } from "../decorator/model.decorator";
import { Metadata } from "./metadata.model";
import { Field as _Field, FIELD_TYPE } from "..";
import { Function } from "./function.model";
import { Field } from "./field.model";

@_Model()
export class Model extends Metadata {
  @_Field({ type: FIELD_TYPE.BOOLEAN })
  private store = true;

  @_Field({ type: FIELD_TYPE.BOOLEAN })
  private virtual = true;

  @_Field({ type: FIELD_TYPE.STRING })
  private key = "";

  @_Field({
    type: FIELD_TYPE.ONE2MANY,
    refModel: "base.function",
    refs: ["namespace"],
    rels: ["code"],
  })
  private functions: Function[] = [];

  @_Field({
    type: FIELD_TYPE.ONE2MANY,
    refModel: "base.field",
    refs: ["namespace"],
    rels: ["code"],
  })
  private fields: Field[] = [];
}
