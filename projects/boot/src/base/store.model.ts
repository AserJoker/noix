import { DATASOURCE_FILE, IDatasource, ITable } from "@noix/data";
import { Field, FIELD_TYPE, IField, Model, NoixService } from ".";
import { BaseModel } from "./base.model";

@Model({ store: false, virtual: true })
export class StoreModel extends BaseModel {
  private _$data?: ITable;
  protected get $data() {
    if (!this._$data) {
      throw new Error("datasource lost");
    }
    return this._$data;
  }
  @Field({ type: FIELD_TYPE.INTEGER })
  private id = 0;
  public queryOne(record: Record<string, unknown>) {
    return record;
  }
  public constructor(service: NoixService) {
    super(service);
    const meta = this.getMetadata();
    if (meta) {
      const datasource =
        this.$factory.createInstance<IDatasource>(DATASOURCE_FILE);
      if (datasource) {
        this._$data = datasource.getTable({
          name: `${meta.namespace}_${meta.name}`,
        });
      } else {
        throw new Error("failed to create datasource");
      }
    } else {
      throw new Error("model metadata lost");
    }
  }
}
