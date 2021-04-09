import { GetMetadata, Metadata } from '@noix/core';
import { watch } from 'vue';
export interface IWatcher {
  path: string;
  name: string;
  deep: boolean;
  immediate: boolean;
}
export class BaseWidget {
  private static _instance: BaseWidget;
  public constructor() {}

  private static setup() {
    this.wachers.forEach((w) => {
      const handle = Reflect.get(this._instance, w.name) as Function;
      const patharr = w.path.split('.');
      watch(
        () => {
          let tmp = this._instance as BaseWidget & { value: unknown };
          for (let index = 0; index < patharr.length; index++) {
            tmp = Reflect.get(tmp, patharr[index]);
          }
          return tmp.value;
        },
        (...args: unknown[]) => handle.apply(this._instance, args),
        {
          deep: w.deep,
          immediate: w.immediate
        }
      );
    });
    return this._instance.setup();
  }

  protected setup() {
    return {};
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
      setup: () => Widget.setup()
    };
  }

  public static Prop<T extends BaseWidget>(target: T, name: string) {
    const props =
      (GetMetadata(
        target.constructor as typeof BaseWidget,
        undefined,
        'props'
      ) as string[]) || [];
    props.push(name);
    return Metadata('props', props)(target.constructor as typeof BaseWidget);
  }

  public static Watch(path: string) {
    return <T extends BaseWidget>(target: T, name: string) => {
      const wachers =
        (GetMetadata(
          target.constructor as typeof BaseWidget,
          undefined,
          'watchers'
        ) as IWatcher[]) || [];
      wachers.push({ path, name, deep: false, immediate: false });
      return Metadata(
        'watchers',
        wachers
      )(target.constructor as typeof BaseWidget);
    };
  }
}
export const Component = BaseWidget.Component;
export const Prop = BaseWidget.Prop;
export const Watch = BaseWidget.Watch;
