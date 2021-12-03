export const clone = <T>(old: T) => {
  const cache: Map<unknown, unknown> = new Map();
  const _clone = <T>(old: T) => {
    if (typeof old === "object" && old) {
      const newObject = Array.isArray(old) ? [] : {};
      const keys = Object.keys(old);
      keys.forEach((key) => {
        const _old = Reflect.get(old as Object, key) as unknown;
        const _new = cache.has(_old) ? cache.get(_old) : _clone(_old);
        if (!cache.has(_old)) {
          cache.set(_old, _new);
        }
        Reflect.set(newObject, key, _new);
      });
      return newObject as T;
    } else {
      return old;
    }
  };
  return _clone(old);
};
