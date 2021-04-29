import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'mock', name: 'Demo', pamiryKey: 'code' })
export class DemoModel extends StoreModel {
  @BaseModel.DataField({ type: 'int' })
  public code = '';
}
