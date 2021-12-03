import { defineComponent, PropType } from "@vue/runtime-core";
import { IViewNode } from "../../types";
import style from "./index.module.scss";
const FlexContainrProps = {
  node: {
    type: Object as PropType<IViewNode>,
    required: true,
  },
};
export const FlexContainer = defineComponent({
  props: FlexContainrProps,
  setup(props, { slots }) {
    return () => (
      <div class={style["flex-container"]}>
        {slots.default && slots.default()}
      </div>
    );
  },
});
