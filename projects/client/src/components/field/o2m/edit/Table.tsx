import { defineComponent, PropType, provide } from "vue";
import { useEffect, useRender } from "../../../../hooks";
import { ListService, State } from "../../../../service";
import { IViewNode } from "../../../../types";
interface ITableResult<T> {
  list: T[];
  total: number;
  current: number;
  pageSize: number;
}
export const Table = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: Object as PropType<ITableResult<Record<string, unknown>>>,
      default: { current: 1, total: 0, pageSize: 10, list: [] },
    },
    onChange: {
      type: Function as PropType<(newValue: Record<string, unknown>[]) => void>,
    },
  },
  setup(props, ctx) {
    const service = new ListService(
      new State(props.value),
      props.node.children.find((c) => c.attrs.model) as IViewNode
    );
    provide("service", service);
    useEffect(() => {
      props.onChange && props.onChange(service.current.raw);
    }, [service.current]);
    return () => {
      return <div>{useRender(props.node.children[0])}</div>;
    };
  },
});
