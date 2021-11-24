export interface IRuntime {
  getClass: <T extends Function>() => T;
  getHandle: <T extends Function>() => T;
}
