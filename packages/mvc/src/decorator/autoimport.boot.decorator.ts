import { Boot } from "./boot.decorator";
import { IFactory } from "@noix/core";
export const AutoImportBoot = (pkgName: string, factory: IFactory) => {
  const pkg = require(pkgName);
  const controllers: Function[] = [];
  const keys = Object.keys(pkg);
  keys.forEach((key) => {
    const controller = pkg[key];
    if (typeof controller === "function") {
      controllers.push(controller);
    }
  });
  return Boot({ controllers, factory });
};
