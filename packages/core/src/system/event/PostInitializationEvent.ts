import { BaseEvent } from '../../event';
export const EVENT_POSTINITIALIZATION = 'event.postInitialization';
export class PostInitializationEvent extends BaseEvent {
  public constructor(target: unknown) {
    super(EVENT_POSTINITIALIZATION, target);
  }
}
