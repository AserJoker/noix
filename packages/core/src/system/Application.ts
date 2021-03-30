import { GetInstance, PromiseQueue, Provide } from '../base';
import { EventObject } from '../event';
import {
  InitializationEvent,
  PostInitializationEvent,
  PreInitializationEvent
} from './event';

export const TOKEN_APPLICATION = 'base.application';
export class Application extends EventObject {
  protected async LoadPlugins() {}
  public async main(): Promise<void> {
    await this.LoadPlugins();
    await PromiseQueue(
      this.EVENT_BUS.Trigger(new PreInitializationEvent(this))
    );
    await PromiseQueue(this.EVENT_BUS.Trigger(new InitializationEvent(this)));
    await PromiseQueue(
      this.EVENT_BUS.Trigger(new PostInitializationEvent(this))
    );
  }

  public static GetInstance() {
    return _instance;
  }
}
export const Bootstrap = <T extends typeof Application>(ClassObject: T) => {
  Provide(TOKEN_APPLICATION)(ClassObject);
  _instance = GetInstance(TOKEN_APPLICATION)!;
  _instance.main();
};

let _instance: Application | null = null;
