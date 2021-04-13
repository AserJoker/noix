import {
  SystemApplication,
  Bootstrap,
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION
} from '@noix/core';
import '@noix/widget';
@Bootstrap
export class ClientApplication extends SystemApplication {
  public async main() {
    super.main();
  }

  @EventListener(EVENT_PREINITIALIZATION)
  public async OnPreInitialize() {
    console.log('pre');
  }

  @EventListener(EVENT_INITIALIZATION)
  public async OnInitialize() {
    console.log('init');
  }

  @EventListener(EVENT_POSTINITIALIZATION)
  public async OnPostInitialize() {
    console.log('post');
  }
}
