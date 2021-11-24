export interface IDatasource {
  dispose(): void | Promise<void>;
  boot(config: Record<string, unknown>): Promise<void>;
}
export type DatasourceClass = {
  new (...args: unknown[]): IDatasource;
};
