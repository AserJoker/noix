import { NoixObject, NoixEventBus, BaseEvent, EventListener } from '@noix/core';

class Base extends NoixObject {
  public static EVENT_BUS: NoixEventBus = new NoixEventBus();
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
    console.log('base');
  }

  @EventListener(BaseEvent.EVENT_NAME)
  public onevent(e: BaseEvent) {
    console.log(e);
  }
}
const a = new A();
const b = new B();
b.GetClassObject();
a.tri();
b.dispose();
a.dispose();
