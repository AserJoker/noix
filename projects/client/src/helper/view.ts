import { IViewNode } from "../types";
const dom2node = (dom: Element): IViewNode => {
  const attrs: Record<string, string> = {};
  for (let index = 0; index < dom.attributes.length; index++) {
    const item = dom.attributes.item(index);
    if (item) {
      attrs[item.name] = item.value;
    }
  }
  const children: IViewNode[] = [];
  for (let index = 0; index < dom.children.length; index++) {
    const child = dom.children.item(index);
    if (child) {
      children.push(dom2node(child));
    }
  }
  return {
    name: dom.tagName,
    children,
    attrs,
  };
};
export const resolveView = (xml: string): IViewNode => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, "text/xml").children[0];
  return dom2node(dom);
};
