import { API } from './API';

@API('core', 'BaseObject')
export class BaseObject {
  private _state: 'released' | 'ready' = 'ready';

  public GetClassObject<T extends typeof BaseObject>() {
    return this.constructor as T;
  }

  public Release() {
    this._state = 'released';
  }

  public IsReady() {
    return this._state === 'ready';
  }
}
