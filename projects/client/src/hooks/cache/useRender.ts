import { Component, DefineComponent, h, VNodeChild } from "@vue/runtime-core";
import { IViewNode } from "../../types";
const components = new Map<string, DefineComponent>();
export const useRender = (node: IViewNode): VNodeChild => {
  const { name } = node;
  const component = components.get(name);
  if (component) {
    return h(component, { node }, () => {
      return node.children.map((c) => useRender(c));
    });
  }
  return null;
};
export const useComponent = <T extends Component>(
  name: string,
  component?: T
) => {
  if (component) {
    components.set(name, component as DefineComponent);
  } else {
    return components.get(name) as T;
  }
};
