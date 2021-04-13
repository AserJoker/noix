import {
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION,
  Bootstrap,
  SystemApplication
} from '@noix/core';
import { Button } from '@noix/widget';
@Bootstrap
export class DemoApplication extends SystemApplication {
  @EventListener(EVENT_PREINITIALIZATION)
  public OnPreInitialize() {}

  @EventListener(EVENT_INITIALIZATION)
  public OnInitialize() {}

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {}
}
console.log(Button);
