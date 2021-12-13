export const deleteOne = (
  param: Record<string, unknown>,
  __: void,
  service: {
    deleteOne: (context: Record<string, unknown>) => Promise<void>;
  }
) => {
  const { context } = param;
  return service.deleteOne(context as Record<string, unknown>);
};
