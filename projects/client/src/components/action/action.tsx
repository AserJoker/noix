import { defineComponent, inject, PropType } from "@vue/runtime-core";
import { NButton } from "naive-ui";
import { BaseService } from "../../service";
import { IViewNode } from "../../types";
const NodeProps = {
  node: {
    type: Object as PropType<IViewNode>,
    required: true,
  },
};
export const Action = defineComponent({
  props: NodeProps,
  setup(props) {
    const service = inject<BaseService<Record<string, unknown>>>("service");
    const onClick = () => {
      service?.execAction(props.node as IViewNode);
    };
    return () => {
      const { node } = props;
      return (
        <NButton onClick={onClick}>{node && node.attrs.displayName}</NButton>
      );
    };
  },
});
