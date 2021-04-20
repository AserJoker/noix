import { BaseModel, StoreModel } from '@noix/engine';
@BaseModel.DataModel({ module: 'base', name: 'User' })
export class UserModel2 extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public username: string = '';

  @BaseModel.DataField({ type: 'string' })
  public password: string = '';

  @BaseModel.DataField({
    type: {
      name: 'Test',
      types: [
        { name: 'a', type: 'string', array: false },
        { name: 'b', type: 'string', array: false }
      ]
    }
  })
  public test: { a: string; b: string } = { a: '', b: '' };

  public static async init<T extends BaseModel>(): Promise<T> {
    return (new UserModel2() as BaseModel) as T;
  }

  public constructor() {
    super();
    this.username = 'init';
  }

  public static async query<T extends BaseModel>(record: T): Promise<T> {
    return record;
  }
}
