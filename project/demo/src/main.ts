import {
  BaseEvent,
  EventBus,
  EVENT_PREINITIALIZATION,
  PreInitializationEvent
} from '@noix/core';
const eba = new EventBus();
const ebb = new EventBus();
const ebc = new EventBus();
ebb.LinkTo(eba);
ebc.LinkTo(eba);
ebb.AddEventListener(EVENT_PREINITIALIZATION, async (event: BaseEvent) => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('b1');
      resolve();
    }, 300)
  );
});
ebb.AddEventListener(EVENT_PREINITIALIZATION, async (event: BaseEvent) => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('b2');
      resolve();
    }, 200)
  );
});
ebc.AddEventListener(EVENT_PREINITIALIZATION, async () => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('b3');
      resolve();
    }, 100)
  );
});
Promise.all(eba.Trigger(new PreInitializationEvent(null), false)).then(() => {
  console.log('end');
});
