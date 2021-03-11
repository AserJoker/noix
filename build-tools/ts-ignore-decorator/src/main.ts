import ts from 'typescript';
export const createTSIgnoreDecoratorTanstormer = (decorator = '@Ignore') => {
  return (context: ts.TransformationContext) => {
    const visit = (node: ts.Node): ts.Node | undefined => {
      if (ts.isClassLike(node)) {
        if (
          node.decorators &&
          node.decorators.find((d) => d.getText() === decorator)
        ) {
          return undefined;
        }
      }
      if (ts.isClassElement(node)) {
        if (
          node.decorators &&
          node.decorators.find((d) => d.getText() === decorator)
        ) {
          return undefined;
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node: ts.Node) => ts.visitNode(node, visit);
  };
};
