import { Factory } from "./factory.decorator";
export const AutoImportFactory = (pkgName: string, token?: string | symbol) => {
  const pkg = require(pkgName);
  const providers: Function[] = [];
  const keys = Object.keys(pkg);
  keys.forEach((key) => {
    const provider = pkg[key];
    if (typeof provider === "function") {
      providers.push(provider);
    }
  });
  return Factory(token || Symbol(), providers);
};
