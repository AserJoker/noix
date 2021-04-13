export const PromiseQueue = <T>(arr: Promise<T>[]) => {
  const result: T[] = [];
  return new Promise<T[]>((resolve) => {
    if (arr.length) {
      const _next = (index: number) => {
        arr[index].then((val) => {
          result.push(val);
          if (index + 1 < arr.length) _next(index + 1);
          else resolve(result);
        });
      };
      _next(0);
    } else {
      resolve([]);
    }
  });
};
