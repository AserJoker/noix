import { Application, Bootstrap, ExtLoader, GetClasses } from '@noix/core';
@Bootstrap
export class ClientApplication extends Application {
  public async main() {
    Reflect.set(window, 'QueryInterface', ExtLoader.QueryInterface);
    const script = document.createElement('script');
    script.src = 'noix.demo-plugin.js';
    document.head.append(script);
  }
}
