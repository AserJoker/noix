import {
  Application,
  Bootstrap,
  QueryInterface,
  EventListener,
  EVENT_PREINITIALIZATION
} from '@noix/core';
@Bootstrap
export class ClientApplication extends Application {
  protected async LoadPlugins() {
    Reflect.set(window, 'QueryInterface', QueryInterface);
    const script = document.createElement('script');
    script.src = 'noix.demo-plugin.js';
    document.head.append(script);
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
