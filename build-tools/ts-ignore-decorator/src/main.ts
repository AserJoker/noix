import ts from 'typescript';
export const createTSIgnoreDecoratorTanstormer = () => {
  return (context: ts.TransformationContext) => {
    const visit = (node: ts.Node): ts.Node | undefined => {
      if (ts.isClassLike(node)) {
        if (
          node.decorators &&
          node.decorators.find((d) => d.getText() === '@Ignore')
        ) {
          return undefined;
        }
      }
      if (ts.isClassElement(node)) {
        if (
          node.decorators &&
          node.decorators.find((d) => d.getText() === '@Ignore')
        ) {
          return undefined;
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node: ts.Node) => ts.visitNode(node, visit);
  };
};
