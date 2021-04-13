interface ICopyCache<T> {
  originObject: T;
  copyObject: T;
}
const _DeepCopy = <T>(originObject: T, caches: ICopyCache<T>[]) => {
  if (originObject === null || typeof originObject !== 'object') {
    return originObject;
  }
  const cache = caches.filter((c) => c.originObject === originObject)[0];
  if (cache) {
    return cache.copyObject;
  }

  const copyObject = (Array.isArray(originObject) ? [] : {}) as T;
  caches.push({
    originObject: originObject,
    copyObject: copyObject
  });

  Object.keys(originObject).forEach(
    (name) =>
      ((copyObject as Record<string, unknown>)[name] = _DeepCopy(
        (originObject as Record<string, unknown>)[name],
        caches
      ))
  );
  return copyObject;
};
export const DeepCopy = <T>(originObject: T) => {
  const caches: { originObject: T; copyObject: T }[] = [];
  const result = _DeepCopy(originObject, caches);
  return result;
};
