export interface IFactory {
  createInstance: <T>(
    token: string | symbol | Function,
    params?: unknown[]
  ) => T | undefined;
}
