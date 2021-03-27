import { EventBus } from './EventBus';

export class EventObject {
  public EVENT_BUS: EventBus;
  public constructor() {
    this.EVENT_BUS = new EventBus();
  }
}
