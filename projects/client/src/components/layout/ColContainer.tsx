import { defineComponent, provide, ref, watch } from "@vue/runtime-core";
import { PropType } from "vue";
import { IViewNode } from "../../types";
import style from "./index.module.scss";
const ColContainrProps = {
  node: {
    type: Object as PropType<IViewNode>,
    required: true,
  },
};
export const ColContainr = defineComponent({
  props: ColContainrProps,
  setup(props, ctx) {
    const _rows = ref(12);
    watch(
      () => props.node && props.node.attrs.rows,
      (value) => {
        _rows.value = typeof value === "string" ? JSON.parse(value) : 12;
      },
      { immediate: true }
    );
    provide("rows", _rows);
    return () => {
      const { slots } = ctx;
      return (
        <div class={style["col-container"]}>
          {slots.default && slots.default()}
        </div>
      );
    };
  },
});
