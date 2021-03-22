import { Application } from './Application';
import { PreInitializationEvent } from './event';

export const Bootstrap = <T extends typeof Application>(ClassObject: T) => {
  ClassObject.EVENT_BUS.Trigger(new PreInitializationEvent(null)).then(() =>
    ClassObject.main()
  );
};
