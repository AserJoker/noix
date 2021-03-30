import { API, Provide } from '../base';
import { Application } from './Application';

@API('core', 'PluginApplication')
export class PluginApplication extends Application {
  private static _pluginInstance: PluginApplication;
  public static _Plugin = (token: Symbol) => {
    return <T extends typeof PluginApplication>(ClassObject: T) => {
      Provide(token);
      ClassObject._pluginInstance = new ClassObject();
    };
  };

  public main() {}
}
export const Plugin = PluginApplication._Plugin;
API('core', 'Plugin')(Plugin);
