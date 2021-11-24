import { memberMetadata } from "../const";

export const getMemberMetadata = <T extends Object>(
  proto: T,
  name: string,
  key?: string
) => {
  const classObject = proto.constructor as Function;
  const classMeta = memberMetadata.get(classObject) || {};
  const current = classMeta[name] || {};
  return key ? current[key] : current;
};
export const setMemberMetadata = <T extends Object>(
  proto: T,
  name: string,
  metadata: Record<string, unknown>
) => {
  const classObject = proto.constructor as Function;
  const classMeta = memberMetadata.get(classObject) || {};
  const current = classMeta[name] || {};
  classMeta[name] = { ...current, ...metadata };
  memberMetadata.set(classObject, classMeta);
};
export const MemberMetadata =
  (metadata: Record<string, unknown>) =>
  <T extends Object>(proto: T, name: string = "meta:constructor") => {
    setMemberMetadata(proto, name, metadata);
  };
