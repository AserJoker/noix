import { API, API_VALUE } from '../../base';
import { BaseEvent } from '../../event';

export const EVENT_INITIALIZATION = 'event.initialization';
@API('core', 'InitializationEvent')
export class InitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_INITIALIZATION, target);
  }
}
API_VALUE('core', 'EVENT_INITIALIZATION', EVENT_INITIALIZATION);
