import { NoixObject } from '../base';
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
NoixObject.DefineDecorator(
  'EventListener',
  (eventName: string | Symbol) => {
    return <T extends NoixObject>(target: T, name: string) => {
      let listeners: {
        name: string;
        listeners: Map<string | Symbol, string>;
      } = Reflect.get(target.GetClassObject(), '__listeners');
      if (!listeners || listeners.name !== target.GetClassObject().name) {
        Reflect.set(target.GetClassObject(), '__listeners', {
          name: target.GetClassObject().name,
          listeners: new Map()
        });
        const oldl = listeners;
        listeners = Reflect.get(target.GetClassObject(), '__listeners');
        oldl && oldl.listeners.forEach((v, k) => listeners.listeners.set(k, v));
      }
      listeners.listeners.set(eventName, name);
    };
  },
  (name: string, instance: NoixObject) => {
    const listeners: {
      name: string;
      listeners: Map<string | Symbol, string>;
    } = Reflect.get(instance.GetClassObject(), '__listeners');
    const EVENT_BUS: NoixEventBus = Reflect.get(
      instance.GetClassObject(),
      'EVENT_BUS'
    );
    if (EVENT_BUS) {
      listeners &&
        listeners.listeners.forEach((name, event) => {
          const handle: Function = Reflect.get(instance, name);
          Reflect.set(instance, name, handle.bind(instance));
          EVENT_BUS.RegisterEventListener(event, Reflect.get(instance, name));
        });
    }
  },
  (name: string, instance: NoixObject) => {
    const listeners: {
      name: string;
      listeners: Map<string | Symbol, string>;
    } = Reflect.get(instance.GetClassObject(), '__listeners');
    const EVENT_BUS: NoixEventBus = Reflect.get(
      instance.GetClassObject(),
      'EVENT_BUS'
    );
    if (
      !EVENT_BUS ||
      !listeners ||
      listeners.name !== instance.GetClassObject().name
    ) {
      listeners.listeners.forEach((name: string, event: string | Symbol) => {
        const handle = Reflect.get(instance, name);
        EVENT_BUS.UnregisterEventListener(event, handle);
      });
    }
  }
);
export const EventListener: (
  event: string | Symbol
) => <T extends NoixObject>(target: T, name: string) => void = Reflect.get(
  NoixObject,
  'EventListener'
);
