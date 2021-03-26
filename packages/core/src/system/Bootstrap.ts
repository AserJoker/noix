import { PromiseQueue } from '@src/base';
import { Application } from './Application';
import { InitializationEvent, PreInitializationEvent } from './event';
import { PostInitializationEvent } from './event/PostInitializationEvent';

export const Bootstrap = <T extends typeof Application>(ClassObject: T) => {
  PromiseQueue(
    ClassObject.EVENT_BUS.Trigger(new PreInitializationEvent(null))
  ).then(() =>
    PromiseQueue(
      ClassObject.EVENT_BUS.Trigger(new InitializationEvent(null))
    ).then(() =>
      PromiseQueue(
        ClassObject.EVENT_BUS.Trigger(new PostInitializationEvent(null))
      ).then(() => ClassObject.main())
    )
  );
};
