import { defineMetadata } from "../../metadata";

export const Provide = (name?: string | symbol, cache: boolean = true) => {
  return <T extends Function>(classObject: T) => {
    defineMetadata(classObject, {
      "spi:provide": name || classObject.name,
      "spi:cache": cache,
    });
  };
};
