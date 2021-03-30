import {
  SystemApplication,
  Bootstrap,
  EventListener,
  EVENT_PREINITIALIZATION
} from '@noix/core';
import { LoadClientPlugins } from './Plugin';
@Bootstrap
export class ClientApplication extends SystemApplication {
  protected async LoadPlugins() {
    return LoadClientPlugins();
  }

  public async main() {
    super.main();
  }

  @EventListener(EVENT_PREINITIALIZATION)
  public async OnPreInitialize() {
    console.log('pre');
  }

  @EventListener(EVENT_PREINITIALIZATION)
  public async OnInitialize() {
    console.log('init');
  }

  @EventListener(EVENT_PREINITIALIZATION)
  public async OnPostInitialize() {
    console.log('post');
  }
}
