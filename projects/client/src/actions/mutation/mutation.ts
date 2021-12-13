export const mutation = (
  param: Record<string, unknown>,
  _: void,
  service: {
    mutation: (
      param: Record<string, unknown>,
      funName: string,
      context: Record<string, unknown>
    ) => Promise<unknown>;
  }
) => {
  const { funName, context, ...others } = param;
  return service.mutation(
    others,
    funName as string,
    context as Record<string, unknown>
  );
};
