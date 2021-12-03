import { defineComponent, inject, PropType, Ref } from "@vue/runtime-core";
import { IViewNode } from "../../types";

export const ColItem = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, ctx) {
    const rows = inject<Ref<number>>("rows");
    return () => {
      const { slots } = ctx;
      const span = props.node.attrs.span as string;
      return (
        <div
          style={{
            height: `${
              (100 / ((rows && rows.value) || 1)) *
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
