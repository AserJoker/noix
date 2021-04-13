import { BaseEvent } from '../../event';

export const EVENT_INITIALIZATION = 'event.initialization';
export class InitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_INITIALIZATION, target);
  }
}
