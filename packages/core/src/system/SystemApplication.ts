import { PromiseQueue } from '../base';
import {
  PreInitializationEvent,
  InitializationEvent,
  PostInitializationEvent
} from './event';
import { Application } from './Application';

export class SystemApplication extends Application {
  public async main(): Promise<void> {
    await PromiseQueue(
      Application.EVENT_BUS.Trigger(new PreInitializationEvent(this))
    );
    await PromiseQueue(
      Application.EVENT_BUS.Trigger(new InitializationEvent(this))
    );
    await PromiseQueue(
      Application.EVENT_BUS.Trigger(new PostInitializationEvent(this))
    );
  }
}
