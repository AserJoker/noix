import { BaseModel, StoreModel } from '@noix/engine';

@BaseModel.DataModel({ module: 'mock', name: 'Demo' })
export class DemoModel extends StoreModel {}
