import { paramMetadata } from "../const";

export const getParamMetadata = <T extends Object>(
  proto: T,
  name: string | undefined,
  index: number,
  key?: string
) => {
  name = name || "meta:constructor";
  const classObject = proto.constructor as Function;
  const classMeta = paramMetadata.get(classObject) || {};
  const current = classMeta[name] || [];
  const meta = current[index] || {};
  return key ? meta[key] : meta;
};
export const setParamMetadata = <T extends Object>(
  proto: T,
  name: string | undefined,
  index: number,
  metadata: Record<string, unknown>
) => {
  name = name || "meta:constructor";
  const classObject = proto.constructor as Function;
  const classMeta = paramMetadata.get(classObject) || {};
  const current = classMeta[name] || [];
  current[index] = { ...current[index], metadata };
  classMeta[name] = current;
  paramMetadata.set(classObject, classMeta);
};
export const ParamMetadata =
  (metadata: Record<string, unknown>) =>
  <T extends Function>(proto: T, name: string, index: number) => {
    setParamMetadata(proto, name, index, metadata);
  };
