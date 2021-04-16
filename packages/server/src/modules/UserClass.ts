import { BaseModel, IQueryOption, StoreModel } from '@noix/engine';
@BaseModel.DataModel({ name: 'user' })
export class UserModel extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public username: string = '';

  @BaseModel.DataField({ type: 'string' })
  public password: string = '';

  public static async query<T extends BaseModel>(
    queryBody: IQueryOption
  ): Promise<T[]> {
    const result: BaseModel = new UserModel() as BaseModel;
    return [result] as T[];
  }
}
