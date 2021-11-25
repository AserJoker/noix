import { IFunction, NoixService } from "..";

export const PAGE_WRAPPER = "wrapper.page";
const PageWrapper = (
  service: NoixService,
  result: {
    current: number;
    list: Record<string, unknown>[];
    total: number;
  },
  fun: IFunction
) => {
  return {
    current: () => result.current,
    total: () => result.total,
    list: service.resolveArray(result.list, fun.returnType as string),
  };
};
NoixService.functionWrappers.set(PAGE_WRAPPER, PageWrapper);
