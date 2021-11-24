export const useHook = (handle: Function, hook: Function): Function => {
  return function (this: unknown, ...args: unknown[]) {
    return hook.call(this, args, (_args: unknown[] = args) =>
      handle.apply(this, _args)
    );
  };
};
