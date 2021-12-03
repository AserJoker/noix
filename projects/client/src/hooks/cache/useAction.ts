const actions: Map<string, Function> = new Map();
export const useAction = <T extends Function>(
  name: string,
  handle?: Function
) => {
  if (handle) {
    actions.set(name, handle);
  } else {
    return actions.get(name) as T;
  }
};
