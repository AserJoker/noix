import { defineComponent, inject, PropType, Ref } from "@vue/runtime-core";
import { IViewNode } from "../../types";

export const RowItem = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, ctx) {
    const cols = inject<Ref<number>>("cols");
    return () => {
      const { slots } = ctx;
      const span = props.node.attrs.span as string;
      return (
        <div
          style={{
            width: `${
              (100 / ((cols && cols.value) || 1)) *
              (typeof span === "string" ? JSON.parse(span) : 4)
            }%`,
          }}
        >
          {slots.default && slots.default()}
        </div>
      );
    };
  },
});
