export interface IViewNode {
  name: string;
  attrs: Record<string, unknown>;
  children: IViewNode[];
}
