import { GetMetadata, Metadata } from '@noix/core';
import {
  isRef,
  ref,
  SetupContext,
  watch,
  computed,
  DefineComponent,
  onMounted,
  inject,
  provide,
  Component as VueComponent
} from 'vue';
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

export interface INameMap {
  displayName: string;
  name: string;
}

export class BaseWidget {
  // private static _instance: BaseWidget;

  public constructor() {}

  private static setup(props: Record<string, unknown>, ctx: SetupContext) {
    const instance = new this();
    const res: Record<string, unknown> = {};
    this.__$injections.forEach((injection) => {
      const $inject = inject(injection.displayName);
      Object.defineProperty(instance, injection.name, {
        get: () => (isRef($inject) ? $inject.value : $inject)
      });
    });
    this.__$emits.forEach((emit) => {
      const handle = Reflect.get(instance, emit.name) as Function;
      Reflect.set(instance, emit.name, (...args: unknown[]) => {
        handle.apply(instance, args);
        ctx.emit.apply(null, [emit.displayName, ...args]);
      });
      res[emit.name] = Reflect.get(instance, emit.name);
    });
    const attributes =
      (GetMetadata(this, undefined, 'attributes') as IAttribute[]) || [];
    attributes.forEach((attr) => {
      const raw = Reflect.get(instance, attr.name) as unknown;
      if (attr.reactive) {
        if (!attr.get) {
          const refValue = ref(raw);
          Object.defineProperty(instance, attr.name, {
            get: () => refValue.value,
            set: (newValue) => (refValue.value = newValue)
          });
          Reflect.set(res, attr.name, refValue);
        } else {
          const computedValue = attr.set
            ? computed({
                get: () => attr.get!.apply(instance),
                set: (newValue) => attr.set!.call(instance, newValue)
              })
            : computed(() => attr.get!.apply(instance));
          Object.defineProperty(instance, attr.name, {
            get: () => computedValue.value,
            set: (newValue) => (computedValue.value = newValue)
          });
          Reflect.set(res, attr.name, computedValue);
        }
      } else {
        if (typeof raw === 'function') {
          Reflect.set(res, attr.name, (...args: unknown[]) =>
            raw.apply(instance, args)
          );
        } else {
          Reflect.set(res, attr.name, raw);
        }
      }
    });
    this.__$wachers.forEach((w) => {
      const handle = Reflect.get(instance, w.name) as Function;
      const name = w.path;
      const refValue = Reflect.get(res, name);
      if (isRef(refValue)) {
        watch(
          () => {
            const value = refValue.value as Record<string, unknown>;
            return w.handle ? w.handle(value) : value;
          },
          (...args: unknown[]) => handle.apply(instance, args),
          {
            deep: w.deep,
            immediate: w.immediate
          }
        );
      } else {
        throw new Error(`ERROR: '${name}' is not reactive`);
      }
    });

    this.__$props.forEach((name) => {
      Object.defineProperty(instance, name, {
        get: () => props[name]
      });
    });
    this.__$refs.forEach((_ref) => {
      const $ref = ref();
      Object.defineProperty(instance, _ref.name, {
        get: () => $ref.value
      });
      res[_ref.displayName] = $ref;
    });
    this.__$providers.forEach((provider) => {
      provide(
        provider.displayName,
        Reflect.get(res, provider.name) || Reflect.get(instance, provider.name)
      );
    });
    onMounted(() => instance.mounted());
    return res;
  }

  private static __$props: string[] = [];

  private static __$wachers: IWatcher[] = [];

  private static __$refs: INameMap[] = [];

  private static __$emits: INameMap[] = [];

  private static __$injections: INameMap[] = [];

  private static __$providers: INameMap[] = [];

  public static Component = (
    options: {
      components?: Record<
        string,
        DefineComponent | VueComponent | typeof BaseWidget
      >;
    } = {}
  ) => <T extends typeof BaseWidget>(Widget: T) => {
    const oldProps = Widget.__$props;
    const newProps = GetMetadata(Widget, undefined, 'props') as string[];
    Widget.__$props = [...oldProps];
    newProps &&
      newProps.forEach(
        (p) => !Widget.__$props.includes(p) && Widget.__$props.push(p)
      );
    const oldWachers = Widget.__$wachers;
    const newWachers = GetMetadata(Widget, undefined, 'watchers') as IWatcher[];
    Widget.__$wachers = [...oldWachers];
    newWachers &&
      newWachers.forEach(
        (w) => !Widget.__$wachers.includes(w) && Widget.__$wachers.push(w)
      );
    Widget.__$refs =
      (GetMetadata(Widget, undefined, 'refs') as INameMap[]) || [];
    Widget.__$providers =
      (GetMetadata(Widget, undefined, 'providers') as INameMap[]) || [];
    Widget.__$injections =
      (GetMetadata(Widget, undefined, 'injections') as INameMap[]) || [];
    Widget.__$emits =
      (GetMetadata(Widget, undefined, 'emits') as INameMap[]) || [];
    return {
      ...Widget,
      setup: (props: Record<string, unknown>, ctx: SetupContext) =>
        Widget.setup(props, ctx),
      components: (options.components as Record<string, DefineComponent>) || {},
      props: Widget.__$props
    };
  };

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

  public static Ref(refName?: string) {
    return <T extends BaseWidget>(target: T, name: string) => {
      const refs =
        (GetMetadata(
          target.constructor as typeof BaseWidget,
          undefined,
          'refs'
        ) as INameMap[]) || [];
      if (!refs.find((ref) => ref.name === name)) {
        refs.push({
          name,
          displayName: refName || name
        } as INameMap);
      }
      return Metadata('refs', refs)(target.constructor as typeof BaseWidget);
    };
  }

  public static Provide = (displayName?: string) => <T extends BaseWidget>(
    target: T,
    name: string
  ) => {
    const providers =
      (GetMetadata(
        target.constructor as typeof BaseWidget,
        undefined,
        'providers'
      ) as INameMap[]) || [];
    if (!providers.find((provider) => provider.name === name)) {
      providers.push({
        name,
        displayName: displayName || name
      } as INameMap);
    }
    return Metadata(
      'providers',
      providers
    )(target.constructor as typeof BaseWidget);
  };

  public static Inject = (displayName?: string) => <T extends BaseWidget>(
    target: T,
    name: string
  ) => {
    const injections =
      (GetMetadata(
        target.constructor as typeof BaseWidget,
        undefined,
        'injections'
      ) as INameMap[]) || [];
    if (!injections.find((injection) => injection.name === name)) {
      injections.push({
        name,
        displayName: displayName || name
      } as INameMap);
    }
    return Metadata(
      'injections',
      injections
    )(target.constructor as typeof BaseWidget);
  };

  public static Emit = (event: string) => <T extends BaseWidget>(
    target: T,
    name: string
  ) => {
    const emits =
      (GetMetadata(
        target.constructor as typeof BaseWidget,
        undefined,
        'emits'
      ) as INameMap[]) || [];
    if (!emits.find((emit) => emit.name === name)) {
      emits.push({
        name,
        displayName: event
      } as INameMap);
    }
    return Metadata('emits', emits)(target.constructor as typeof BaseWidget);
  };

  protected mounted(): void | Promise<void> {}
}
export const Component = BaseWidget.Component;
export const Prop = BaseWidget.Prop;
export const Watch = BaseWidget.Watch;
export const Attribute = BaseWidget.Attribute;
export const Ref = BaseWidget.Ref;
export const Emit = BaseWidget.Emit;
export const Provide = BaseWidget.Provide;
export const Inject = BaseWidget.Inject;
