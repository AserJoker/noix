class _Hook {
  private static _afterHooks: Map<
    Function,
    { name: string; type: 'after' | 'before' }[]
  > = new Map();

  private static _CreateHandle(host: Function) {
    return {
      handle(...args: unknown[]) {
        const hooks = _Hook._afterHooks.get(this.constructor) || [];
        let _args = args;
        hooks
          .filter((hook) => hook.type === 'after')
          .forEach((hook) => {
            const handle = Reflect.get(this, hook.name) as Function;
            _args = handle.apply(this, args) || args;
          });
        let res = host.apply(this, _args);
        hooks
          .filter((hook) => hook.type === 'before')
          .forEach((hook) => {
            const handle = Reflect.get(this, hook.name) as Function;
            res = handle.apply(this, [res]) || res;
          });
        return res;
      }
    };
  }

  private static _BaseHook(hostName: string, type: 'after' | 'before') {
    return <T extends Object, K extends Function>(
      target: T,
      name: string,
      description: TypedPropertyDescriptor<K>
    ) => {
      const handle = Reflect.get(target, hostName);
      const ahs = _Hook._afterHooks.get(target.constructor) || [];
      if (ahs.length === 0) {
        Reflect.set(target, hostName, _Hook._CreateHandle(handle).handle);
      }
      ahs.push({ name, type });
      _Hook._afterHooks.set(target.constructor, ahs);
    };
  }

  public static AfterHook(hostName: string) {
    return _Hook._BaseHook(hostName, 'after');
  }

  public static BeforeHook(hostName: string) {
    return _Hook._BaseHook(hostName, 'before');
  }
}
export const AfterHook = _Hook.AfterHook;
export const BeforeHook = _Hook.BeforeHook;
