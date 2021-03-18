import { NoixObject, NoixEventBus, BaseEvent, EventListener } from '@noix/core';

class Base extends NoixObject {
  public static EVENT_BUS: NoixEventBus = new NoixEventBus();
}
class A extends Base {
  public tri() {
    Base.EVENT_BUS.Trigger(new BaseEvent(BaseEvent.EVENT_NAME, this));
  }

  public constructor() {
    super();
  }
}
class B extends Base {
  public constructor() {
    super();
  }

  @EventListener(BaseEvent.EVENT_NAME)
  public onevent(e: BaseEvent) {
    console.log(e);
  }
}
const a = new A();
const b = new B();
a.tri();
b.Release();
a.Release();
