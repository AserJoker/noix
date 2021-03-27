import { API, API_VALUE } from '@src/base';
import { BaseEvent } from '../../event';
export const EVENT_POSTINITIALIZATION = 'event.postInitialization';
@API('core', 'PostInitializationEvent')
export class PostInitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_POSTINITIALIZATION, target);
  }
}
API_VALUE('EVENT_POSTINITIALIZATION', EVENT_POSTINITIALIZATION);
