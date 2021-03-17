import { BaseEvent } from './BaseEvent';
export class NoixEventBus {
  private __listeners: Map<
    string | Symbol,
    (<T extends BaseEvent>(event: T) => boolean | void)[]
  > = new Map();

  private __linkers: NoixEventBus[] = [];

  public Trigger = <T extends BaseEvent>(event: T) => {
    const _handles = this.__listeners.get(event.GetEventName()) || [];
    let handles = [..._handles];
    this.__linkers.forEach(
      (link) =>
        (handles = [
          ...handles,
          ...(link.__listeners.get(event.GetEventName()) || [])
        ])
    );
    const next = (index: number) => {
      if (index < handles.length) {
        const handle = handles[index];
        Promise.resolve(handle(event)).then(
          (result) => result && next(index + 1)
        );
      }
    };
    next(0);
  };

  public RegisterEventListener = (
    eventName: string | Symbol,
    handle: <T extends BaseEvent>(event: T) => boolean | void
  ) => {
    const _listeners = this.__listeners.get(eventName) || [];
    _listeners.push(handle);
    this.__listeners.set(eventName, _listeners);
  };

  public UnregisterEventListener = (
    eventName: string | Symbol,
    handle: <T extends BaseEvent>(event: T) => boolean | void
  ) => {
    const _listeners = this.__listeners.get(eventName) || [];
    const index = _listeners.findIndex((h) => h === handle);
    _listeners.splice(index, 1);
    this.__listeners.set(eventName, _listeners);
  };

  public LinkTo(eventBus: NoixEventBus) {
    if (eventBus.__linkers.find((l) => l === this)) {
      return false;
    }
    eventBus.__linkers.push(this);
  }

  public UnlinkTo(eventBus: NoixEventBus) {
    const index = eventBus.__linkers.findIndex((l) => l === this);
    if (index !== -1) {
      eventBus.__linkers.splice(index, 1);
    }
  }
}
