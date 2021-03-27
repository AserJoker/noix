import { API } from '@src/base';

@API('core', 'BaseEvent')
export class BaseEvent {
  private _type: string | Symbol;

  private _target: unknown | null;

  protected constructor(type: string | Symbol, target: unknown | null = null) {
    this._type = type;
    this._target = target;
  }

  public GetEventType() {
    return this._type;
  }

  public GetEventTarget<T>() {
    return this._target as T;
  }
}
