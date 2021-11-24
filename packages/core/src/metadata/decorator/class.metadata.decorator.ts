import { classMetadata } from "../const";

export const getClassMetadata = <T extends Function>(
  classObject: T,
  key?: string
) => {
  const meta = classMetadata.get(classObject) || {};
  return key ? meta[key] : meta;
};
export const setClassMetadata = <T extends Function>(
  classObject: T,
  metadata: Record<string, unknown>
) => {
  const current = classMetadata.get(classObject) || {};
  classMetadata.set(classObject, { ...current, ...metadata });
};
export const ClassMetadata =
  (metadata: Record<string, unknown>) =>
  <T extends Function>(classObject: T) => {
    setClassMetadata(classObject, metadata);
  };
