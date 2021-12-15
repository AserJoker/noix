import { defineComponent, onMounted, PropType, provide } from "vue";
import { ListService, ObjectService, State } from "../../service";
import { IViewNode } from "../../types";

export const Data = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { node } = props;
    const type = node.attrs.type as "object" | "list";
    const service =
      type === "object"
        ? new ObjectService<Record<string, unknown>>(new State({}), node)
        : new ListService<Record<string, unknown>>(
            new State({ current: 1, pageSize: 10, total: 0, list: [] }),
            node
          );
    provide("service", service);
    return () => {
      return <div>{slots.default && slots.default()}</div>;
    };
  },
});
