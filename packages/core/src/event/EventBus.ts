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

  private _SyncTrigger<T extends BaseEvent>(event: T) {
    const handles = this._eventListener.get(event.GetEventType());
    if (handles) {
      return new Promise<void>((resolve) => {
        const next = (index: number) => {
          if (index < handles.length) {
            Promise.resolve(handles[index](event)).then(() => next(index + 1));
          } else resolve();
        };
        next(0);
      });
    }
    return Promise.resolve();
  }

  private _AsyncTrigger<T extends BaseEvent>(event: T): Promise<void[]> {
    const handles = this._eventListener.get(event.GetEventType());
    if (handles) {
      return Promise.all(
        handles.map((handle) => handle(event) as Promise<void>)
      );
    } else return Promise.resolve([]);
  }
  public Trigger<T extends BaseEvent>(event: T, sync: boolean = true) {
    return sync ? this._SyncTrigger(event) : this._AsyncTrigger(event);
  }
}
