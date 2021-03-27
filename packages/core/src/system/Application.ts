import {
  ClientSide,
  ExtLoader,
  PromiseQueue,
  Provide,
  ServerSide
} from '../base';
import { EventObject } from '../event';
import {
  InitializationEvent,
  PostInitializationEvent,
  PreInitializationEvent
} from './event';

let _instance: Application | null = null;

export const TOKEN_APPLICATION = 'base.application';
export class Application extends EventObject {
  public main(): Promise<void> | void {}
  public static GetInstance() {
    return _instance;
  }
}
export const Bootstrap = <T extends typeof Application>(ClassObject: T) => {
  Provide(TOKEN_APPLICATION)(ClassObject);
  _instance = ExtLoader.GetInstance(TOKEN_APPLICATION)!;
  PromiseQueue(
    _instance!.EVENT_BUS.Trigger(new PreInitializationEvent(null))
  ).then(() =>
    PromiseQueue(
      _instance!.EVENT_BUS.Trigger(new InitializationEvent(null))
    ).then(() =>
      PromiseQueue(
        _instance!.EVENT_BUS.Trigger(new PostInitializationEvent(null))
      ).then(() => _instance!.main())
    )
  );
};
