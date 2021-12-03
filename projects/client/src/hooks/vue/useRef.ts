import { Ref, ref, UnwrapRef } from "@vue/runtime-core";
import { useEffect } from "..";
import { IReactiveState } from "../../service";

export const useRef = <T>(state: IReactiveState<T>): Ref<T> => {
  const value = ref<T>(state.raw);
  useEffect(() => {
    value.value = state.raw as UnwrapRef<T>;
  }, [state]);
  return value as Ref<T>;
};
