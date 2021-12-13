import { defineComponent, onMounted, PropType, provide } from "vue";
import { ListService, State } from "../../service";
import { IViewNode } from "../../types";

export const DataTable = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { node } = props;
    const service = new ListService<Record<string, unknown>>(
      new State({ current: 1, pageSize: 10, total: 0, list: [] }),
      node
    );
    provide("service", service);
    onMounted(() => {
      service.load();
    });
    return () => {
      return <div>{slots.default && slots.default()}</div>;
    };
  },
});
