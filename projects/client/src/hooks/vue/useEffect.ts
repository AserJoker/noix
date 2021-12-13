import { onUnmounted } from "@vue/runtime-core";
import { IReactiveState, IWatcherOption } from "../../service";

export const useEffect = (
  handle: Function,
  states: IReactiveState[],
  options?: IWatcherOption
) => {
  const releases = states.map((state) => {
    return state.watch(handle, options);
  });
  onUnmounted(() => {
    releases.forEach((release) => release());
  });
};
