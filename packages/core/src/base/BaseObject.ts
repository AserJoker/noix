import { API } from './API';

@API('core', 'BaseObject')
export class BaseObject {
  public GetClassObject<T extends typeof BaseObject>() {
    return this.constructor as T;
  }
}
