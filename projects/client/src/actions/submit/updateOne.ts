export const updateOne = (
  param: Record<string, unknown>,
  __: void,
  service: {
    updateOne: (context: Record<string, unknown>) => Promise<void>;
  }
) => {
  const { context } = param;
  return service.updateOne(context as Record<string, unknown>);
};
