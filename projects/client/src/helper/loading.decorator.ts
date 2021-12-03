declare function setTimeout(
  handler: TimerHandler,
  timeout?: number,
  ...arguments: any[]
): number;
export const Loading = <
  T extends { loading: { value: boolean } },
  K extends Function
>(
  target: T,
  name: string,
  descriptor: TypedPropertyDescriptor<K>
) => {
  const handle = descriptor.value as Function;
  let id = 0;
  const rangeHook: Function = async function (this: T, ...args: unknown[]) {
    id = setTimeout(() => {
      this.loading.value = true;
    }, 200);
    const res = handle.apply(this, args) as Promise<unknown>;
    res.finally(() => {
      if (id) {
        clearTimeout(id);
        id = 0;
      }
      this.loading.value = false;
    });
    return res;
  };
  descriptor.value = rangeHook as K;
};
