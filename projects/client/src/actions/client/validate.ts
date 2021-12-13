import { IViewNode } from "../../types";

export const validate = (
  _: void,
  node: IViewNode,
  service: { validate: () => Promise<void> }
) => {
  return service.validate();
};
