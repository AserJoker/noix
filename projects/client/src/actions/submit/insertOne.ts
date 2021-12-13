export const insertOne = (
  param: Record<string, unknown>,
  __: void,
  service: {
    insertOne: (context: Record<string, unknown>) => Promise<void>;
  }
) => {
  const { context } = param;
  return service.insertOne(context as Record<string, unknown>);
};
