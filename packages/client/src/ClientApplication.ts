import { Application, Bootstrap, QueryInterface } from '@noix/core';
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
}
