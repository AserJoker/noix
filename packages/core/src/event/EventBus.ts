import { BaseEvent } from './BaseEvent';

export class EventBus {
  private _eventListener: Map<string | Symbol, Function[]> = new Map();

  private _links: EventBus[] = [];
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

  private _SyncTrigger<T extends BaseEvent>(event: T): Promise<void>[] {
    const handles = this._eventListener.get(event.GetEventType());
    if (handles) {
      return [
        new Promise<void>((resolve) => {
          const next = (index: number) => {
            if (index < handles.length) {
              Promise.resolve(handles[index](event)).then(() =>
                next(index + 1)
              );
            } else {
              const nextlink = (linkindex: number) => {
                if (linkindex < this._links.length) {
                  const p = this._links[linkindex].Trigger(event, true);
                  if (Array.isArray(p)) {
                    Promise.all(p).then(() => nextlink(linkindex + 1));
                  }
                } else {
                  resolve();
                }
              };
              nextlink(0);
            }
          };
          next(0);
        })
      ];
    }
    return [
      new Promise<void>((resolve) => {
        const nextlink = (linkindex: number) => {
          if (linkindex < this._links.length) {
            const p = this._links[linkindex].Trigger(event, true);
            if (Array.isArray(p)) {
              Promise.all(p).then(() => nextlink(linkindex + 1));
            }
          } else {
            resolve();
          }
        };
        nextlink(0);
      })
    ];
  }

  private _AsyncTrigger<T extends BaseEvent>(event: T): Promise<void>[] {
    const handles = this._eventListener.get(event.GetEventType());
    if (handles) {
      const promiseArr: Promise<void>[] = [
        ...handles.map((handle) => handle(event) as Promise<void>)
      ];
      console.log(handles);
      this._links
        .map((link) => link.Trigger(event, false))
        .map((p) => (!Array.isArray(p) ? [p] : p))
        .forEach((p) => promiseArr.push(...p));
      return promiseArr;
    } else return [];
  }

  public Trigger<T extends BaseEvent>(event: T, sync: boolean = true) {
    return sync ? this._SyncTrigger(event) : this._AsyncTrigger(event);
  }

  public LinkTo(parent: EventBus) {
    parent._links.push(this);
  }

  public UnlinkTo(parent: EventBus) {
    const index = parent._links.findIndex((l) => l === this);
    if (index !== -1) {
      parent._links.splice(index, 1);
    }
  }
}
