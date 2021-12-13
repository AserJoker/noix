export const submit = (
  param: Record<string, unknown>,
  _: void,
  service: {
    submit: (
      param: Record<string, unknown>,
      funName: string,
      context: Record<string, unknown>
    ) => Promise<unknown>;
  }
) => {
  const { funName, context, ...others } = param;
  return service.submit(
    others,
    funName as string,
    context as Record<string, unknown>
  );
};
