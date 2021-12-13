export interface IMessage<T extends string> {
  type: T;
  param: Record<string, unknown>;
}
const handles: Map<string, Function[]> = new Map();
export const useMessage = () => {
  return {
    postMessage<T extends string>(msg: T, param: Record<string, unknown>) {
      const cbs = handles.get(msg) || [];
      return cbs.reduce((last, now) => {
        return last.then(() => now({ msg, param }));
      }, new Promise<void>((resolve) => resolve()));
    },
    on<T extends string>(
      type: T,
      cb: (msg: IMessage<T>) => void | Promise<void>
    ) {
      const _handles = handles.get(type) || [];
      _handles.push(cb);
      handles.set(type, _handles);
      return () => {
        const __handles = handles.get(type) || [];
        const index = __handles.findIndex((h) => h === cb);
        if (index !== -1) {
          __handles.splice(index, 1);
        }
      };
    },
  };
};
