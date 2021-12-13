import { BaseService, IReactiveState, ObjectService, State } from ".";
import { IViewNode } from "../types";
import { queryPage } from "../hooks";
import { convertViewToSchema } from "../helper/view";
import { Loading } from "../helper/loading.decorator";

interface ITableResult<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
}

export class ListService<T extends Record<string, unknown>> extends BaseService<
  ITableResult<T>
> {
  private _search: IReactiveState<Record<string, unknown>>;
  public execAction(node: IViewNode): Promise<void> {
    return super._execAction(node, {
      ...this.state.raw,
      current: this.current.raw,
    });
  }
  public execActionWithRow(node: IViewNode, rowIndex: number) {
    return super._execAction(node, {
      ...this.state.raw,
      current: [this.state.raw.list[rowIndex]],
    });
  }

  public constructor(
    defaultValue: IReactiveState<ITableResult<T>>,
    node: IViewNode
  ) {
    super(defaultValue, node);
    this._search = new State({});
  }

  public get search() {
    return this._search;
  }

  @Loading
  public async queryPage(
    context: Record<string, unknown> = {},
    baseURL?: string
  ) {
    const model = this.node.raw.attrs.model as string;
    const schema = convertViewToSchema(
      this.node.raw.children.find((c) => c.name === "table") as IViewNode
    );
    const result = await queryPage<T>(
      model,
      this.search.raw,
      this.state.raw.current,
      this.state.raw.pageSize,
      schema,
      context,
      baseURL
    );
    if (result) {
      this.state.value = {
        current: result.current,
        total: result.total,
        pageSize: this.state.raw.pageSize,
        list: result.list,
      };
    }
  }
  public async setPageSize(pageSize: number) {
    this.state.setRaw({
      ...this.state.raw,
      pageSize,
      current: 1,
    });
    return this.queryPage();
  }
  public async setCurrentPage(current: number) {
    this.state.setRaw({
      ...this.state.raw,
      current,
    });
    return this.queryPage();
  }
  public async reset() {
    this.search.value = {};
    return this.load();
  }
  public async load() {
    this.state.setRaw({
      ...this.state.raw,
      current: 1,
    });
    return this.queryPage();
  }
}
