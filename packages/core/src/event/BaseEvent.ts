import { NoixObject } from '../base';

export class BaseEvent extends NoixObject {
  public static EVENT_NAME: string | Symbol = Symbol('EVENT.BASE');
  private target?: NoixObject;
  private name: string | Symbol;
  public constructor(name: string | Symbol, target?: NoixObject) {
    super();
    this.name = name;
    this.target = target;
  }

  public GetTarget() {
    return this.target;
  }

  public GetEventName() {
    return this.name;
  }
}
