
export class BaseEvent<T = unknown> {
  public static EVENT_NAME: string | Symbol = Symbol('EVENT.BASE');
  private target?: T;
  private name: string | Symbol;
  public constructor(name: string | Symbol, target?: T) {
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
