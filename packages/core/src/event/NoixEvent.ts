import { BaseEvent } from './BaseEvent';
export class NoixEvent {
  private __listeners: Map<
    string | Symbol,
    (<T extends BaseEvent>(event: T) => boolean | void)[]
  > = new Map();

  public Trigger = <T extends BaseEvent>(event: T) => {
    const handles = this.__listeners.get(event.GetEventName()) || [];
    const next = (index: number) => {
      const handle = handles[index];
      if (index < handles.length) {
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
}
