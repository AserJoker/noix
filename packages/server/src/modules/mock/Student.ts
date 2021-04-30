import { StoreModel } from '@noix/engine';
import { BaseModel } from '@noix/engine';
import { Teacher } from './Teacher';

@BaseModel.DataModel({ module: 'mock', name: 'Student' })
export class Student extends StoreModel {
  @BaseModel.DataField({
    type: Teacher,
    array: true,
    storeRelation: true,
    rel: 'id',
    ref: 'id'
  })
  public teachers: Teacher[] = [];

  @BaseModel.DataField({ type: 'string' })
  public name = '';

  public static async InitDataSource() {
    await super.InitDataSource();
    const mock = new Student();
    mock.name = 's1';
    mock.teachers.push(
      (await (await Teacher.QueryList(-1, -1, `(EQU name "t1")`))
        .list[0]) as Teacher
    );
    this.Insert(mock);
  }
}
