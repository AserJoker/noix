import {
  computed,
  defineComponent,
  inject,
  PropType,
  watch,
} from "@vue/runtime-core";
import { NButton } from "naive-ui";
import { useRef } from "../../hooks";
import { BaseService, ListService } from "../../service";
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
    if (!service) {
      throw new Error("service is not defined");
    }
    const onClick = () => {
      service.execAction(props.node as IViewNode);
    };
    const current = useRef(service.current);
    const disabled = computed(() => {
      const contextType = props.node && props.node.attrs.contextType;
      if (contextType) {
        if (contextType === "SINGLE" && current.value.length !== 1) {
          return true;
        }
        if (contextType === "BATCH" && current.value.length <= 1) {
          return true;
        }
        if (contextType === "SINGLE_AND_BATCH" && current.value.length === 0) {
          return true;
        }
      }
      return false;
    });
    return () => {
      const { node } = props;
      return (
        <NButton
          text={node && node.attrs.inline === "true"}
          type={
            (node && (node.attrs.type as "default" | "error" | "primary")) ||
            "default"
          }
          onClick={onClick}
          disabled={disabled.value}
        >
          {node && node.attrs.displayName}
        </NButton>
      );
    };
  },
});
