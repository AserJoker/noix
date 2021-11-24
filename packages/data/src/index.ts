import { FileDatasource } from "./datasource";
import { DatasourceClass } from "./types";

export * from "./types";
export const datasource_providers = [FileDatasource] as DatasourceClass[];
export { DATASOURCE_FILE } from "./datasource";
