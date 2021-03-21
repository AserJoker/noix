class _SPI {
  private static _provider: Map<string | Symbol, Function> = new Map();
  private static _instance: Map<string | Symbol, Object> = new Map();

  public static Provide(token: string | Symbol) {
    return <T extends { new (): unknown }>(target: T) => {
      _SPI._provider.set(token, target);
    };
  }

  public static QueryInterface<T extends Function>(token: string | Symbol) {
    return _SPI._provider.get(token) as T;
  }

  public static CreateInstance<T>(token: string | Symbol): T | undefined {
    const ClassObject = _SPI._provider.get(token) as { new (): T };
    return ClassObject && new ClassObject();
  }

  public static GetInstance<T>(token: string | Symbol): T | undefined {
    const instance = _SPI._instance.get(token);
    if (instance) return instance as T;
    const ClassObject = _SPI._provider.get(token) as { new (): T };
    if (ClassObject) {
      _SPI._instance.set(token, new ClassObject());
      return _SPI._instance.get(token) as T;
    }
    return undefined;
  }

  public static Instance(token: string | Symbol) {
    return <T extends Object>(target: T, name: string) => {
      Reflect.set(target, name, _SPI.CreateInstance(token));
    };
  }
}
export const Provide = _SPI.Provide;
export const Instance = _SPI.Instance;
export const ExtLoader = {
  QueryInterface: _SPI.QueryInterface,
  CreateInstance: _SPI.CreateInstance
};
