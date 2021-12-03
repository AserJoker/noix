import { ISchema } from "../hooks";
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

const resolveField = (node: IViewNode, schema: ISchema) => {
  if (
    node.attrs.type === "STRING" ||
    node.attrs.type === "TEXT" ||
    node.attrs.type === "ENUM"
  ) {
    schema[node.attrs.field as string] = "string";
  } else if (node.attrs.type === "INTEGER" || node.attrs.type === "FLOAT") {
    schema[node.attrs.field as string] = "number";
  } else if (node.attrs.type === "BOOLEAN") {
    schema[node.attrs.field as string] = "boolean";
  } else {
    const modelSchema: ISchema = {};
    resolveModel(
      node.children.find((c) => c.attrs.model) as IViewNode,
      modelSchema
    );
    schema[node.attrs.field as string] = modelSchema;
  }
};

const resolveModel = (node: IViewNode, schema: ISchema) => {
  node.children.forEach((c) => {
    resolveNode(c, schema);
  });
};
const resolveNode = (node: IViewNode, schema: ISchema) => {
  if (node.attrs.field) {
    resolveField(node, schema);
  } else if (node.attrs.model) {
    resolveModel(node, schema);
  } else {
    node.children.forEach((c) => resolveNode(c, schema));
  }
};
export const convertViewToSchema = (node: IViewNode): ISchema => {
  if (!node.attrs.model) {
    throw new Error("cannot convert not-model-node to schema");
  }
  const schema: ISchema = {};
  resolveModel(node, schema);
  return schema;
};
