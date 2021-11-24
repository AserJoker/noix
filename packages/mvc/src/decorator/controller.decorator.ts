import { Metadata, Provide } from "@noix/core";

export const Controller = (path: string) => {
  return <T extends Function>(classObject: T) => {
    if (path.endsWith("/")) {
      path = path.substr(0, path.length - 1);
    }
    Metadata({ "mvc:path": path })(classObject);
    Provide(Symbol(path.toString()))(classObject);
  };
};
