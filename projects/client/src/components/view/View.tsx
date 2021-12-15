import { NSpin } from "naive-ui";
import { defineComponent, PropType, provide, ref, watch } from "vue";
import { resolveView } from "../../helper/view";
import { useRender, useView } from "../../hooks";
import { IViewNode } from "../../types";

export const View = defineComponent({
  props: {
    view: {
      type: String,
    },
    param: {
      type: Object as PropType<Record<string, unknown>>,
      default: {},
    },
  },
  setup(props, ctx) {
    const param = ref<Record<string, unknown>>({});
    const node = ref<IViewNode | undefined>(undefined);
    watch(
      () => props.param,
      () => {
        param.value = props.param;
      }
    );
    watch(
      () => props.view,
      () => {
        if (props.view) {
          node.value = undefined;
          useView(props.view).then((view) => {
            node.value = view && resolveView(view.xml);
          });
        }
      },
      {
        immediate: true,
      }
    );
    provide("view-param", param);
    return () => {
      return node.value ? useRender(node.value) : <NSpin show={true} />;
    };
  },
});
