import { API, BaseObject } from '../base';
import { EventBus, ReleaseCallback } from './EventBus';

@API('core', 'EventObject')
export class EventObject extends BaseObject {
  protected static EVENT_BUS = new EventBus();
  private static _listeners: {
    name: string;
    list: { event: string | Symbol; name: string }[];
  } = {
    name: EventObject.name,
    list: []
  };

  private _rootLink: ReleaseCallback | null = null;
  private _listenersLinks: ReleaseCallback[] = [];
  public EVENT_BUS: EventBus;
  public constructor() {
    super();
    this.EVENT_BUS = new EventBus();
    this._rootLink = this.EVENT_BUS.LinkTo(
      this.GetClassObject<typeof EventObject>().EVENT_BUS
    );
    this.GetClassObject<typeof EventObject>()._listeners.list.forEach(
      (item) => {
        const rawhandle = Reflect.get(this, item.name) as Function;
        const handle = (...args: unknown[]) => rawhandle.apply(this, args);
        Reflect.set(this, item.name, handle);
        this._listenersLinks.push(
          this.EVENT_BUS.AddEventListener(item.event, handle)
        );
      }
    );
  }

  public Release() {
    if (this._rootLink) {
      this._rootLink.Release();
      this._rootLink = null;
    }
    this._listenersLinks.forEach((l) => l.Release());
    this._listenersLinks = [];
    super.Release();
  }

  public static EventListener(event: string | Symbol) {
    return <T extends EventObject, K extends Function>(
      target: T,
      name: string,
      description: TypedPropertyDescriptor<K>
    ) => {
      const ClassObject = target.GetClassObject<typeof EventObject>();
      if (ClassObject._listeners.name === ClassObject.name) {
        ClassObject._listeners.list.push({ name, event });
      } else {
        ClassObject._listeners = {
          name: ClassObject.name,
          list: [{ name, event }]
        };
      }
    };
  }
}
export const EventListener = EventObject.EventListener;
API('core', 'EventListener')(EventListener);
