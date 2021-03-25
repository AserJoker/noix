import { BaseEvent } from '../../event';

export const EVENT_PREINITIALIZATION = 'event.preinitialization';
export class PreInitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_PREINITIALIZATION, target);
  }
}
