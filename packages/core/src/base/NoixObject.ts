export class NoixObject {
  private static __classList: Map<
    string | Symbol,
    typeof NoixObject
  > = new Map();

  private static __metadata: {
    name: string;
    meta: Record<string, Record<string, unknown>>;
  } = { name: NoixObject.name, meta: {} };

  private static __hook: {
    name: string;
    hooks: {
      name: string;
      type: 'after' | 'before';
      host: string;
    }[];
  } = { name: NoixObject.name, hooks: [] };

  private static Metadata = (name: string, value?: unknown) => <
    T extends NoixObject,
    K extends typeof NoixObject
  >(
    target: T | K,
    fieldName?: string
  ) => {
    if (fieldName) {
      const classObject = <typeof NoixObject>target.constructor;
      const metadata = classObject.__metadata;
      if (metadata.name === classObject.name) {
        if (!metadata.meta[fieldName]) {
          metadata.meta[fieldName] = {};
        }
        metadata.meta[fieldName][name] = value || true;
      } else {
        classObject.__metadata = {
          name: classObject.name,
          meta: { [fieldName]: { [name]: value || true } }
        };
        Object.keys(metadata.meta).forEach(
          (name) => (classObject.__metadata.meta[name] = metadata.meta[name])
        );
      }
    } else {
      const meta = NoixObject.__metadata.meta['class:' + (<K>target).name];
      if (meta) {
        meta[name] = value;
      } else {
        NoixObject.__metadata.meta['class:' + (<K>target).name] = {
          [name]: value || true
        };
      }
    }
  };

  private static GetMetadata<T extends typeof NoixObject>(
    classObject: T,
    fieldName: string,
    name?: string
  ) {
    if (name) {
      const metadata = classObject.__metadata.meta[fieldName];
      if (metadata) {
        return metadata[name];
      }
    } else {
      const metadata = NoixObject.__metadata.meta[`class:${classObject.name}`];
      if (metadata) {
        return metadata[fieldName];
      }
    }
  }

  private static AfterHook(host: string) {
    return NoixObject._Hook(host, 'after');
  }

  private static BeforeHook(host: string) {
    return NoixObject._Hook(host, 'before');
  }

  private static _Hook(host: string, type: 'after' | 'before') {
    return <T extends NoixObject>(target: T, name: string) => {
      const classObject = target.constructor as typeof NoixObject;
      let hook = classObject.__hook;
      if (hook.name !== classObject.name) {
        classObject.__hook = { hooks: [], name: classObject.name };
        hook.hooks.forEach((_h) => classObject.__hook.hooks.push(_h));
        hook = classObject.__hook;
      }
      hook.hooks.push({ name, type, host });
    };
  }

  private static ExtLoader = {
    get: (token: string | Symbol) => {
      return NoixObject.__classList.get(token);
    },
    set: <T extends typeof NoixObject>(token: string | Symbol, target: T) => {
      NoixObject.__classList.set(token, target);
    }
  };

  private static Provide(token: string | Symbol) {
    return <T extends typeof NoixObject>(target: T) => {
      // NoixObject.__classList.set(token, target);
      NoixObject.ExtLoader.set(token, target);
    };
  }

  private static Instance(token: string | Symbol) {
    return <T extends NoixObject>(target: T, name: string) => {
      Reflect.set(target, name, new (NoixObject.ExtLoader.get(token)!)());
    };
  }

  protected constructor() {
    const _hook = this.GetClassObject().__hook;
    _hook.hooks.forEach((hook) => {
      const host = Reflect.get(this, hook.host) as Function;
      if (typeof host !== 'function') {
        throw new Error(
          `hook: host ${hook.host} in class ${
            this.GetClassObject().name
          } is not a function!`
        );
      }
      const handle = Reflect.get(this, hook.name) as Function;
      if (typeof handle !== 'function') {
        throw new Error(
          `hook: hook ${hook.name} in class ${
            this.GetClassObject().name
          } is not a function`
        );
      }
      Reflect.set(this, hook.host, (...args: unknown[]) => {
        if (hook.type === 'before') {
          const res: unknown[] = handle.apply(this, args);
          return host.apply(this, res);
        } else {
          const res = host.apply(this, args);
          return handle.apply(this, [res]);
        }
      });
    });
    NoixObject.__decorators.forEach(
      (d) => d.initHandle && d.initHandle(d.name, this)
    );
  }

  public GetClassObject<T extends typeof NoixObject>(): T {
    return this.constructor as T;
  }

  public dispose() {
    NoixObject.__decorators.forEach(
      (d) => d.disposeHandle && d.disposeHandle(d.name, this)
    );
  }

  public static DefineDecorator(
    name: string,
    handle: Function,
    initHandle?: <T extends NoixObject>(name: string, instance: T) => void,
    disposeHandle?: <T extends NoixObject>(name: string, instance: T) => void
  ) {
    Reflect.set(NoixObject, name, handle);
    this.__decorators.push({ name, handle, initHandle, disposeHandle });
  }

  private static __decorators: {
    name: string;
    handle: Function;
    initHandle?: <T extends NoixObject>(name: string, instance: T) => void;
    disposeHandle?: <T extends NoixObject>(name: string, instance: T) => void;
  }[] = [];
}
