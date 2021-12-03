import { Ref, ref } from "vue";

export const usePromise = <T>(promise: Promise<T>) => {
  const data: Ref<T | null> = ref(null);
  const loading: Ref<boolean> = ref(true);
  const error: Ref<Error | null> = ref(null);
  promise
    .then((d) => {
      data.value = d;
      loading.value = false;
    })
    .catch((e) => {
      error.value = e;
      loading.value = false;
    });
  return { data, loading, error };
};
