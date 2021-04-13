import { API, API_VALUE } from '../../base';
import { BaseEvent } from '../../event';
export const EVENT_POSTINITIALIZATION = 'event.postInitialization';
@API('core', 'PostInitializationEvent')
export class PostInitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_POSTINITIALIZATION, target);
  }
}
API_VALUE('core', 'EVENT_POSTINITIALIZATION', EVENT_POSTINITIALIZATION);
