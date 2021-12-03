import { IReactiveState } from "../../service";
import { ref, UnwrapRef } from "vue";
import { useEffect } from "..";
export const useField = <T, K>(
  state: IReactiveState<T>,
  getter: (record: T) => K,
  setter: (record: T, newValue: K) => void
) => {
  const value = ref(getter(state.raw));
  useEffect(() => {
    value.value = getter(state.raw) as UnwrapRef<K>;
  }, [state]);
  const onChange = (value: K) => {
    setter(state.value, value);
  };
  return { value, onChange };
};
