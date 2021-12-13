import { IViewNode } from ".";
import { BaseService } from "../service";

export interface IActionHandle<T> {
  <Service extends BaseService>(
    param: T,
    node: IViewNode,
    service: Service
  ): void | Promise<void>;
}
