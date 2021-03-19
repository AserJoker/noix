class _Metadata {
  private static _meta: WeakMap<
    Function,
    Record<string, Map<string | Symbol, unknown>>
  > = new Map();

  private static _Class(name: string | Symbol, value: unknown) {
    return <T extends Function>(classObject: T) => {
      const field = 'class:' + classObject.name;
      _Metadata._Field(name, value)({ constructor: classObject }, field);
    };
  }

  private static _Field(name: string | Symbol, value: unknown) {
    return <T extends Object>(target: T, field: string) => {
      const classObject = target.constructor;
      const _meta = _Metadata._meta.get(classObject) || {};
      if (!_meta[field]) {
        _meta[field] = new Map();
      }
      _meta[field].set(name, value);
      _Metadata._meta.set(classObject, _meta);
    };
  }

  public static Meta(name: string | Symbol, value: unknown) {
    return <T extends Object>(target: T, fieldName?: string) => {
      if (typeof target === 'function') {
        return _Metadata._Class(name, value)(target);
      } else return _Metadata._Field(name, value)(target, fieldName!);
    };
  }

  public static Get(
    classObject: { new (): unknown },
    field?: string,
    name?: string | Symbol
  ): unknown {
    const _meta = _Metadata._meta.get(classObject);
    const fieldname = field || 'class:' + classObject.name;
    if (_meta && _meta[fieldname]) {
      const res = name ? _meta[fieldname].get(name) : _meta[fieldname];
      if (res) return res;
    }
    const extendsClassObject = Object.getPrototypeOf(classObject);
    if (extendsClassObject) {
      return _Metadata.Get(extendsClassObject, field, name);
    }
  }
}
export const Metadata = _Metadata.Meta;
export const GetMetadata = _Metadata.Get;
