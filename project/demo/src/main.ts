import {
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION,
  Bootstrap,
  SystemApplication
} from '@noix/core';
import { NoixButton } from '@noix/widget';
import { createApp, h } from 'vue';
@Bootstrap
export class DemoApplication extends SystemApplication {
  @EventListener(EVENT_PREINITIALIZATION)
  public OnPreInitialize() {}

  @EventListener(EVENT_INITIALIZATION)
  public OnInitialize() {
    createApp({
      render() {
        return h(NoixButton);
      }
    }).mount(document.body);
  }

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {}
}
