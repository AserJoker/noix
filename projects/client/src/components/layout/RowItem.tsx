import {
  defineComponent,
  inject,
  PropType,
  Ref,
  ref,
  provide,
} from "@vue/runtime-core";
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
    const invisible = ref(false);
    provide("invisible", invisible);
    return () => {
      const { slots } = ctx;
      const span = props.node.attrs.span as string;
      const width = props.node.attrs.width as string;
      return (
        <div
          style={{
            width: width
              ? `${width}px`
              : `${
                  (100 / ((cols && cols.value) || 1)) *
                  (typeof span === "string" ? JSON.parse(span) : 4)
                }%`,
            display: invisible.value ? "none" : "unset",
          }}
        >
          {slots.default && slots.default()}
        </div>
      );
    };
  },
});
