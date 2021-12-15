export const deleteBatch = (
  param: { records: Record<string, unknown>[] },
  __: void,
  service: {
    deleteOne: (context: Record<string, unknown>) => Promise<void>;
    current: {
      value: Record<string, unknown>[];
    };
    reset: () => Promise<void>;
  }
) => {
  const { records } = param;
  return Promise.all(records.map((r) => service.deleteOne(r))).then(() => {
    service.current.value = [];
    return service.reset();
  });
};
