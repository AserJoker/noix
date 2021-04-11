import { GetMetadata, Metadata } from '@noix/core';
import { isRef, ref, SetupContext, watch, computed } from 'vue';
export interface IWatcher {
  path: string;
  name: string;
  deep: boolean;
  immediate: boolean;
  handle?: (value: Record<string, unknown>) => unknown;
}
export interface IAttribute<T = unknown> {
  name: string;
  displayName?: string;
  reactive?: boolean;
  get?: () => T;
  set?: (newValue: T) => void;
}
export class BaseWidget {
  private static _instance: BaseWidget;
  public constructor() {}

  private static setup(props: Record<string, unknown>, ctx: SetupContext) {
    const res = {};
    const attributes =
      (GetMetadata(this, undefined, 'attributes') as IAttribute[]) || [];
    attributes.forEach((attr) => {
      const raw = Reflect.get(this._instance, attr.name) as unknown;
      if (attr.reactive) {
        if (!attr.get) {
          const refValue = ref(raw);
          Object.defineProperty(this._instance, attr.name, {
            get: () => refValue.value,
            set: (newValue) => (refValue.value = newValue)
          });
          Reflect.set(res, attr.name, refValue);
        } else {
          const computedValue = attr.set
            ? computed({
                get: () => attr.get!.apply(this._instance),
                set: (newValue) => attr.set!.call(this._instance, newValue)
              })
            : computed(() => attr.get!.apply(this._instance));
          Object.defineProperty(this._instance, attr.name, {
            get: () => computedValue.value,
            set: (newValue) => (computedValue.value = newValue)
          });
          Reflect.set(res, attr.name, computedValue);
        }
      } else {
        if (typeof raw === 'function') {
          Reflect.set(res, attr.name, (...args: unknown[]) =>
            raw.apply(this._instance, args)
          );
        } else {
          Reflect.set(res, attr.name, raw);
        }
      }
    });
    this.wachers.forEach((w) => {
      const handle = Reflect.get(this._instance, w.name) as Function;
      const name = w.path;
      const refValue = Reflect.get(res, name);
      if (isRef(refValue)) {
        watch(
          () => {
            const value = refValue.value as Record<string, unknown>;
            return w.handle ? w.handle(value) : value;
          },
          (...args: unknown[]) => handle.apply(this._instance, args),
          {
            deep: w.deep,
            immediate: w.immediate
          }
        );
      } else {
        throw new Error(`ERROR: '${name}' is not reactive`);
      }
    });

    this.props.forEach((name) => {
      Object.defineProperty(this._instance, name, {
        get: () => props[name]
      });
    });
    return res;
  }

  private static props: string[] = [];

  private static wachers: IWatcher[] = [];

  public static Component<T extends typeof BaseWidget>(Widget: T) {
    Widget._instance = new Widget();
    const oldProps = Widget.props;
    const newProps = GetMetadata(Widget, undefined, 'props') as string[];
    Widget.props = [...oldProps];
    newProps &&
      newProps.forEach(
        (p) => !Widget.props.includes(p) && Widget.props.push(p)
      );
    const oldWachers = Widget.wachers;
    const newWachers = GetMetadata(Widget, undefined, 'watchers') as IWatcher[];
    Widget.wachers = [...oldWachers];
    newWachers &&
      newWachers.forEach(
        (w) => !Widget.wachers.includes(w) && Widget.wachers.push(w)
      );
    return {
      ...Widget,
      setup: (props: Record<string, unknown>, ctx: SetupContext) =>
        Widget.setup(props, ctx)
    };
  }

  public static Prop = (opt = {}) => <T extends BaseWidget>(
    target: T,
    name: string
  ) => {
    const props =
      (GetMetadata(
        target.constructor as typeof BaseWidget,
        undefined,
        'props'
      ) as string[]) || [];
    props.push(name);
    return Metadata('props', props)(target.constructor as typeof BaseWidget);
  };

  public static Watch(
    path: string,
    opt: {
      deep?: boolean;
      immediate?: boolean;
      handle?: (value: Record<string, unknown>) => unknown;
    } = {}
  ) {
    return <T extends BaseWidget>(target: T, name: string) => {
      const wachers =
        (GetMetadata(
          target.constructor as typeof BaseWidget,
          undefined,
          'watchers'
        ) as IWatcher[]) || [];
      wachers.push({
        path,
        name,
        deep: opt.deep || false,
        immediate: opt.immediate || false,
        handle: opt.handle
      });
      return Metadata(
        'watchers',
        wachers
      )(target.constructor as typeof BaseWidget);
    };
  }

  public static Attribute(
    opt: { reactive?: boolean; displayName?: string } = {}
  ) {
    return <T extends BaseWidget, K>(
      target: T,
      name: string,
      descriptor?: TypedPropertyDescriptor<K>
    ) => {
      const attributes =
        (GetMetadata(
          target.constructor as typeof BaseWidget,
          undefined,
          'attributes'
        ) as IAttribute[]) || [];
      if (!attributes.find((attr) => attr.name === name)) {
        attributes.push({
          name,
          displayName: opt.displayName || name,
          reactive: opt.reactive || false,
          get: descriptor?.get,
          set: descriptor?.set
        } as IAttribute<unknown>);
      }
      return Metadata(
        'attributes',
        attributes
      )(target.constructor as typeof BaseWidget);
    };
  }
}
export const Component = BaseWidget.Component;
export const Prop = BaseWidget.Prop;
export const Watch = BaseWidget.Watch;
export const Attribute = BaseWidget.Attribute;
