import http from "http";
export interface IApplication {
  getConfig(name: string): Record<string, unknown>;
  boot(server: http.Server): void;
}
