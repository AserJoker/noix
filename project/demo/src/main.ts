import { NoixObject, NoixEvent, BaseEvent } from '@noix/core';
class Base extends NoixObject {
  public static EVENT_BUS: NoixEvent = new NoixEvent();
}
class A extends Base {
  public tri() {
    Base.EVENT_BUS.Trigger(new BaseEvent(BaseEvent.EVENT_NAME, this));
  }

  constructor() {
    super();
    this.GetClassObject();
  }
}
class B extends Base {
  constructor() {
    super();
    Base.EVENT_BUS.RegisterEventListener(
      BaseEvent.EVENT_NAME,
      (event: BaseEvent) => console.log(event)
    );
  }
}
const a = new A();
const b = new B();
b.GetClassObject();
a.tri();
