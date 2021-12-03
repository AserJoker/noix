import { defineComponent, PropType } from "@vue/runtime-core";
import { IViewNode } from "../../../../types";

export const Text = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () => <div>{props.value}</div>;
  },
});
