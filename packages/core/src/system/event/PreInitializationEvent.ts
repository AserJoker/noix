import { API, API_VALUE } from '@src/base';
import { BaseEvent } from '../../event';

export const EVENT_PREINITIALIZATION = 'event.preinitialization';
@API('core', 'PreInitializationEvent')
export class PreInitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_PREINITIALIZATION, target);
  }
}
API_VALUE('EVENT_PREINITIALIZATION', EVENT_PREINITIALIZATION);
