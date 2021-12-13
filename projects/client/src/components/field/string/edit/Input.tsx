import { defineComponent, PropType } from "@vue/runtime-core";
import { NInput } from "naive-ui";
import { IViewNode } from "../../../../types";

export const Input = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function as PropType<(newValue: string) => void>,
    },
  },
  setup(props) {
    return () => (
      <NInput
        value={props.value}
        onUpdateValue={props.onChange}
        disabled={props.disabled}
      />
    );
  },
});
