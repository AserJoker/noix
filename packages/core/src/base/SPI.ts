class _SPI {
  private static _provider: Map<string | Symbol, Function> = new Map();

  public static Provide(token: string | Symbol) {
    return <T extends { new (): unknown }>(target: T) => {
      _SPI._provider.set(token, target);
    };
  }

  public static GetClass<T extends Function>(token: string | Symbol) {
    return _SPI._provider.get(token) as T;
  }

  public static GetInstance<T>(token: string | Symbol) {
    const ClassObject = _SPI._provider.get(token) as { new (): T };
    return ClassObject && new ClassObject();
  }

  public static Instance(token: string | Symbol) {
    return <T extends Object>(target: T, name: string) => {
      Reflect.set(target, name, _SPI.GetInstance(token));
    };
  }
}
export const Provide = _SPI.Provide;
export const Instance = _SPI.Instance;
export const ExtLoader = {
  GetClassObject: _SPI.GetClass,
  GetInstace: _SPI.GetInstance
};
