import { onUnmounted } from "@vue/runtime-core";
import { IReactiveState } from "../../service";

export const useEffect = (handle: Function, states: IReactiveState[]) => {
  const releases = states.map((state) => {
    return state.watch(handle);
  });
  onUnmounted(() => {
    releases.forEach((release) => release());
  });
};
