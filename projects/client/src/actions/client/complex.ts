import { BaseService } from "../../service";
import { IActionHandle, IViewNode } from "../../types";

export const complex: IActionHandle<void> = <Service extends BaseService>(
  _: void,
  node: IViewNode,
  service: Service
) => {
  return node.children.reduce((last, now) => {
    return last.then(() => service.execAction(now));
  }, new Promise<void>((resolve) => resolve()));
};
