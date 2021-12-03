import { provide, ref, UnwrapRef, watch } from "@vue/runtime-core";

export const useProvide = <T>(
  name: string,
  value: () => T,
  reactive?: boolean
) => {
  if (!reactive) {
    provide(name, value());
  } else {
    const _ref = ref(value());
    watch(value, (v) => (_ref.value = v as UnwrapRef<T>));
    provide(name, _ref);
  }
};
