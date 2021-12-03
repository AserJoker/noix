import { defineComponent, provide, ref, watch } from "@vue/runtime-core";
import { PropType } from "vue";
import { IViewNode } from "../../types";
import style from "./index.module.scss";
const RowContainrProps = {
  node: {
    type: Object as PropType<IViewNode>,
    required: true,
  },
};
export const RowContainr = defineComponent({
  props: RowContainrProps,
  setup(props, ctx) {
    const _cols = ref(12);
    watch(
      () => props.node && props.node.attrs.cols,
      (value) => {
        _cols.value = typeof value === "string" ? JSON.parse(value) : 12;
      },
      { immediate: true }
    );
    provide("cols", _cols);
    return () => {
      const { slots } = ctx;
      return (
        <div class={style["row-container"]}>
          {slots.default && slots.default()}
        </div>
      );
    };
  },
});
