export class Logger {
  private static _resolver: ((
    source: string,
    type: 'info' | 'warn' | 'error' | 'debug',
    module: string
  ) => string)[] = [];
  public static Info(module: string, info: string) {
    const str = `INFO [${module}]: ${info}`;
    let res = str;
    this._resolver.forEach((resolver) => {
      res = resolver(res, 'info', module);
    });
    console.log(res);
  }
  public static Warn(module: string, info: string) {
    const str = `WARN [${module}]: ${info}`;
    let res = str;
    this._resolver.forEach((resolver) => {
      res = resolver(res, 'warn', module);
    });
    console.log(res);
  }
  public static Error(module: string, info: string) {
    const str = `ERROR [${module}]: ${info}`;
    let res = str;
    this._resolver.forEach((resolver) => {
      res = resolver(res, 'error', module);
    });
    console.log(res);
  }
  public static Debug(module: string, info: string) {
    const str = `DEBUG [${module}]: ${info}`;
    let res = str;
    this._resolver.forEach((resolver) => {
      res = resolver(res, 'debug', module);
    });
    console.log(res);
  }
  public static use(
    resolver: (
      source: string,
      type: 'info' | 'warn' | 'error' | 'debug',
      module: string
    ) => string
  ) {
    const index = this._resolver.push(resolver);
    return {
      release: () => {
        this._resolver.splice(index - 1, 1);
      }
    };
  }
}
