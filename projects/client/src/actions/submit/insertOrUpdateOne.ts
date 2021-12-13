export const insertOrUpdateOne = (
  param: Record<string, unknown>,
  __: void,
  service: {
    insertOrUpdateOne: (context: Record<string, unknown>) => Promise<void>;
  }
) => {
  const { context } = param;
  return service.insertOrUpdateOne(context as Record<string, unknown>);
};
