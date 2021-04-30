import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'base', name: 'View', pamiryKey: 'id' })
export class View extends StoreModel {
  @BaseModel.DataField({ type: 'string' })
  public template: string = '';

  @BaseModel.DataField({ type: 'string' })
  public name: string = '';

  @BaseModel.DataField({ type: 'string' })
  public bindingModule: string = '';

  public static async InitDefaultData() {
    const table = new View();
    table.name = 'DEMO_TABLE';
    table.template = `
      $Model[render="FORM" name="Student"]
        $Field[name="id"]#Field
        $Field[name="name"]#Field
        $Field[name="teachers"]#Field
        $Action[render="button" fun="delete" displayName="删除"]#Action
      #Model
    `.replace(/\"/g, '\\"');
    table.bindingModule = 'mock';
    this.Insert(table);
  }
}
