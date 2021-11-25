import { DATASOURCE_FILE, IDatasource, ITable } from "@noix/data";
import {
  Field,
  FIELD_TYPE,
  IComplexField,
  IField,
  Model,
  NoixService,
} from ".";
import { NoixFactory } from "../NoixFactory";
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

  private getRelationFields() {
    const m2m = this.$metadata.fields.filter(
      (f) => f.type === FIELD_TYPE.MANY2MANY
    );
    const m2o = this.$metadata.fields.filter(
      (f) => f.type === FIELD_TYPE.MANY2ONE
    );
    const o2m = this.$metadata.fields.filter(
      (f) => f.type === FIELD_TYPE.ONE2MANY
    );
    const o2o = this.$metadata.fields.filter(
      (f) => f.type === FIELD_TYPE.ONE2ONE
    );
    return [m2m, m2o, o2m, o2o];
  }

  private async insertOrUpdateM2O(
    field: IComplexField,
    record: Record<string, unknown>
  ) {
    const value = record[field.name] as Record<string, unknown>;
    const [module, name] = field.refModel.split(".");
    const service = NoixService.select(module);
    if (service) {
      const _record = await service.call<Record<string, unknown>>(
        name,
        "insertOrUpdateOne",
        [value]
      );
      if (_record) {
        field.refs.forEach((ref, index) => {
          const rel = field.rels[index];
          record[rel] = _record[ref];
        });
      }
    }
  }
  private async insertorUpdateO2M(
    field: IComplexField,
    record: Record<string, unknown>
  ) {
    const value = record[field.name] as Record<string, unknown>[];
    field.refs.forEach((ref, index) => {
      const rel = field.rels[index];
      value.forEach((item) => {
        item[ref] = record[rel];
      });
    });
    const [module, name] = field.refModel.split(".");
    const service = NoixService.select(module);
    if (service) {
      await value.reduce(async (last, current) => {
        await last;
        await service.call(name, "insertOrUpdateOne", [current]);
      }, new Promise<void>((resolve) => resolve()));
    }
  }

  public async queryOne(record: Record<string, unknown>) {
    await this.$data.lock();
    const list = await this.$data.select(record);
    await this.$data.unlock();
    return list[0];
  }
  public async insertOne(record: Record<string, unknown>) {
    await this.$data.lock();
    const [m2m, m2o, o2m, o2o] = this.getRelationFields();
    await m2o
      .filter((f) => !!record[f.name])
      .reduce(async (last, field) => {
        await last;
        await this.insertOrUpdateM2O(field as IComplexField, record);
      }, new Promise<void>((resolve) => resolve()));
    const result = await this.$data.insert(record);
    await o2m
      .filter((f) => !!record[f.name])
      .reduce(async (last, field) => {
        await last;
        await this.insertorUpdateO2M(field as IComplexField, record);
      }, new Promise<void>((resolve) => resolve()));
    await this.$data.unlock();
    return result;
  }
  public async updateOne(record: Record<string, unknown>) {
    await this.$data.lock();
    const result = await this.$data.update(record);
    await this.$data.unlock();
    return result;
  }
  public async deleteOne(record: Record<string, unknown>) {
    await this.$data.lock();
    const result = await this.$data.delete(record);
    await this.$data.unlock();
    return result;
  }
  public async insertOrUpdateOne(record: Record<string, unknown>) {
    if (record[this.$data.getKey()] === undefined) {
      return this.insertOne(record);
    } else {
      return this.updateOne(record);
    }
  }
  public async queryList(record: Record<string, unknown>) {
    await this.$data.lock();
    const result = await this.$data.select(record);
    await this.$data.unlock();
    return result;
  }

  public async queryPage(
    record: Record<string, unknown>,
    current: number,
    pageSize: number
  ) {
    await this.$data.lock();
    const list = await this.$data.select(record);
    const total = await this.$data.count();
    await this.$data.unlock();
    return {
      current,
      total,
      list: list.splice((current - 1) * pageSize, pageSize),
    };
  }
  public constructor(service: NoixService, factory: NoixFactory) {
    super(service, factory);
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
