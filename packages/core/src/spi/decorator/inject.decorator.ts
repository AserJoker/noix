import { defineMetadata, getMetadata } from "../../metadata";
export const Inject = (token: string | symbol) => {
  return <T extends typeof Object | Object>(
    proto: T,
    name: string | undefined,
    index?: number | undefined
  ) => {
    if (!name) {
      const classObject = proto as typeof Object;
      const tokens =
        (getMetadata(proto, "meta:constructor", "spi:params") as (
          | string
          | symbol
        )[]) || [];
      tokens[index as number] = token;
      defineMetadata(classObject.prototype, "meta:constructor", {
        "spi:inject": tokens,
      });
    } else {
      const tokens =
        (getMetadata(proto.constructor, "spi:inject") as Record<
          string,
          string | symbol
        >) || {};
      tokens[name] = token;
      defineMetadata(proto.constructor, { "spi:inject": tokens });
    }
  };
};
