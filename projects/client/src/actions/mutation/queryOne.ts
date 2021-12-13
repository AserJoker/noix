export const queryOne = (
  param: Record<string, unknown>,
  _: void,
  service: { queryOne: (context: Record<string, unknown>) => Promise<unknown> }
) => {
  const { context } = param;
  return service.queryOne(context as Record<string, unknown>);
};
