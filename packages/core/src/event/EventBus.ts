import { BaseEvent } from './BaseEvent';

export class EventBus {
  private _eventListener: Map<string | Symbol, Function[]> = new Map();
  public AddEventListener<T extends Function>(
    event: string | Symbol,
    handle: T
  ) {
    const handles = this._eventListener.get(event);
    if (handles) handles.push(handle);
    else this._eventListener.set(event, [handle]);
  }

  public RemoveEventListener<T extends Function>(
    event: string | Symbol,
    handle: T
  ) {
    const handles = this._eventListener.get(event);
    if (handles) {
      const index = handles.findIndex((h) => h === handle);
      if (index !== -1) {
        handles.splice(index, -1);
      }
    }
  }

  public Trigger<T extends BaseEvent>(event: T) {
    const handles = this._eventListener.get(event.GetEventType());
    if (handles) {
      const next = (index: number) => {
        if (index < handles.length) {
          Promise.resolve(handles[index](event)).then(() => next(index + 1));
        }
      };
      next(0);
    }
  }
}
