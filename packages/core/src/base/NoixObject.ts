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

  public static Metadata = (name: string, value?: unknown) => <
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

  public static GetMetadata<T extends typeof NoixObject>(
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

  public static AfterHook(host: string) {
    return NoixObject._Hook(host, 'after');
  }

  public static BeforeHook(host: string) {
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
  }

  public GetClassObject<T extends typeof NoixObject>(): T {
    return this.constructor as T;
  }

  public static Provide(token: string | Symbol) {
    return <T extends typeof NoixObject>(target: T) => {
      NoixObject.__classList.set(token, target);
    };
  }

  public static Instance(token: string | Symbol) {
    return <T extends NoixObject>(target: T, name: string) => {
      Reflect.set(target, name, new (NoixObject.__classList.get(token)!)());
    };
  }
}
