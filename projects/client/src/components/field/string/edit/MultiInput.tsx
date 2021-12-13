import { defineComponent, PropType } from "@vue/runtime-core";
import { NInput } from "naive-ui";
import { IViewNode } from "../../../../types";

export const MultiInput = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: Object as PropType<Array<String>>,
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function as PropType<(newValue: string[]) => void>,
    },
  },
  setup(props) {
    return () => (
      <NInput
        value={(props.value || []).join(",")}
        onUpdateValue={(val) =>
          props.onChange && props.onChange((val || "").split(","))
        }
        disabled={props.disabled}
      />
    );
  },
});
